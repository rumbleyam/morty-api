/**
 * Post Route
 * Handles requests and forwards to the Post Service
 */

const Joi = require('joi');

// Valid fields are all keys on the model
let validFields = _.keys(Morty.models.post.schema.obj);

// Valid sort options are all fields both negative and positive
let validSortOptions = validFields.concat(validFields.map((item) => {
	return `-${item}`;
}));

var _schemas = {
	id : Joi.string(),
	search : Joi.object().keys({
		sort : Joi.alternatives().try(
			Joi.string().valid(validSortOptions),
			Joi.array().items(Joi.string().valid(validSortOptions))
		),
		searchText : Joi.string().min(1),
		fields : Joi.alternatives().try(
			Joi.string().valid(validFields),
			Joi.array().items(Joi.string().valid(validFields))
		),
		limit : Joi.number().integer().min(0),
		skip : Joi.number().integer().min(0),
		page : Joi.number().integer().min(1),
		per_page : Joi.number().integer().min(1),
		deleted : Joi.boolean(),
		published : Joi.boolean(),
		categories : Joi.alternatives().try(
			Joi.string(),
			Joi.array().items(Joi.string())
		),
		tags : Joi.alternatives().try(
			Joi.string(),
			Joi.array().items(Joi.string())
		),
		template : Joi.alternatives().try(
			Joi.string(),
			Joi.array().items(Joi.string())
		)
	}),
	create : Joi.object().keys({
		author : Joi.string(),
		title : Joi.string().required(),
		description : Joi.string().required(),
		content : Joi.string().required(),
		slug : Joi.string(),
		categories : Joi.array().items(Joi.string()),
		tags : Joi.array().items(Joi.string()),
		template : Joi.string(),
		published : Joi.boolean()
	}),
	update : Joi.object().keys({
		author : Joi.string(),
		title : Joi.string(),
		description : Joi.string(),
		content : Joi.string(),
		slug : Joi.string(),
		categories : Joi.array().items(Joi.string()),
		tags : Joi.array().items(Joi.string()),
		template : Joi.string(),
		published : Joi.boolean(),
		deleted : Joi.boolean()
	})
};

module.exports = (server, prefix) => {
	/**
	 * Search for Posts
	 */
	server.get(`${prefix}/`, Morty.middleware.lookupUser, (req, res, next) => {
		const validation = Joi.validate(req.query, _schemas.search);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		// Set the limit and skip to values provided
		// Default to 20 entries skipping 0
		let limit = _.isNumber(req.query.limit) ? req.query.limit : 20;
		let skip = _.isNumber(req.query.skip) ? req.query.skip : 0;

		// If page and per_page are set use those instead of limit and skip
		if(_.isNumber(req.query.page) && _.isNumber(req.query.per_page)){
			limit = req.query.per_page;
			skip = (req.query.page - 1) * req.query.per_page;
		}

		// Handle searching for deleted posts
		// Only admins can see deleted posts
		let deleted = req.user.isAdmin ? Boolean(req.query.deleted) : false;

		// Handle searching for unpublished posts
		let unpublished = false;
		if(req.query.unpublished){
			if(req.user.isAdmin || req.user.isEditor){
				unpublished = true;
			}
			// TODO: Revisit allowing an author to search for their unpublished posts
		}

		// TODO: Support posted dates
		// TODO: Handle meta data
		// TODO: Handle errors
		return Morty.services.post.search({
			searchText  : req.query.searchText,
			fields      : req.query.fields,
			sort        : req.query.sort,
			limit       : limit,
			skip        : skip,
			deleted     : deleted,
			unpublished : unpublished,
			categories  : req.query.categories,
			tags        : req.query.tags,
			template    : req.query.template
		}).then((result) => {
			res.header('X-Total-Count', result.count);
			// TODO: Link Headers
			res.json(result.posts);
		});
	});

	/**
	 * Create new Post
	 */
	server.post(`${prefix}/`, Morty.middleware.isAuthor, (req, res, next) => {
		const validation = Joi.validate(req.body, _schemas.create);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		// If the user is not an admin then they can only create their own posts
		// If the user is an admin, but no author is provided, default to their id
		if(!req.user.isAdmin || !req.body.author){
			req.body.author = req.user.id;
		}

		return Morty.services.post.create(req.body).then((result) => {
			res.json(result);
		}).catch((err) => {
			// TODO: Handle errors better
			res.status(400);
			res.json(err);
		});
	});

	/**
	 * Find a single Post by id or slug
	 */
	server.get(`${prefix}/:id`, Morty.middleware.lookupUser, (req, res, next) => {
		const validation = Joi.validate(req.params.id, _schemas.id);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		// Test if the provided id is a valid Object Id
		// If not, treat it as a slug
		return Morty.services.post.findOne({
			[Morty.utility.isValidObjectId(req.params.id) ? 'id' : 'slug'] : req.params.id,
			fields : req.query.fields
		}).then((result) => {
			if(result){
				// Ensure the user can view this post
				// If it isn't published, must be the post Owner, an Editor, or an Admin
				// If it's deleted, must be an Admin
				if(
					req.user.isAdmin ||
					(req.user.isEditor && !result.deleted) ||
					((result.published || String(result.author) == req.user.id) && !result.deleted)
				){
					res.json(result);
				} else{
					res.status(403);
					return res.json({
						message : 'Insufficient access to view this post.'
					});
				}
			} else{
				res.status(404);
				return res.json({
					message : 'Post not found'
				});
			}
		}).catch((err) => {
			// TODO: Handle errors better
			res.status(400);
			res.json(err);
		});
	});

	/**
	 * Update a single Post by id
	 * Supports partial updates through JSON Merge Patch (RFC 7396)
	 */
	server.patch(`${prefix}/:id`, Morty.middleware.isAuthor, (req, res, next) => {
		var validation = Joi.validate(req.params.id, _schemas.id);
		if(!validation.error){
			validation = Joi.validate(req.body, _schemas.update);
		}

		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		return Morty.services.post.findOne({id : req.params.id}).then((result) => {
			if(result){
				// Ensure the user can update this post
				// If it isn't published, must be the post Owner, an Editor, or an Admin
				// If it's deleted, must be an Admin
				if(
					req.user.isAdmin ||
					(req.user.isEditor && !result.deleted) ||
					(req.user.isAuthor && String(result.author) == req.user.id && !result.deleted)
				){
					return Morty.services.post.updateById(req.params.id, req.body).then((result) => {
						res.json(result);
					}).catch((err) => {
						// TODO: Handle errors better
						res.status(400);
						return res.json(err);
					});
				} else{
					res.status(404);
					return res.json({
						message : 'Insufficient access to edit this post.'
					});
				}
			} else{
				res.status(404);
				return res.json({
					message : 'Post not found'
				});
			}
		});
	});

	/**
	 * Deletes a single Post by id
	 */
	server.del(`${prefix}/:id`, Morty.middleware.isAdmin, (req, res, next) => {
		const validation = Joi.validate(req.params.id, _schemas.id);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}
		// TODO: Support hard deletes
		// TODO: Handle errors
		return Morty.services.post.softDelete(req.params.id).then((result) => {
			res.json(result);
		}).catch((err) => {
			// TODO: Handle errors better
			res.status(400);
			return res.json(err);
		});
	});
};
