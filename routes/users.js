/**
 * User Route
 * Handles requests and forwards to the User Service
 */

const Joi = require('joi');

// Valid fields are all keys on the model
let validFields = _.keys(Morty.models.user.schema.obj);

// Valid sort options are all fields both negative and positive
let validSortOptions = validFields.concat(validFields.map((item) => {
	return `-${item}`;
}));

var _schemas = {
	id : Joi.string(),
	findById : Joi.object().keys({
		fields : Joi.alternatives().try(
			Joi.string().valid(validFields),
			Joi.array().items(Joi.string().valid(validFields))
		)
	}),
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
		role : Joi.string().valid(Morty.models.user.schema.obj.role.enum)
	}),
	create : Joi.object().keys({
		username : Joi.string().alphanum().min(3).max(30).required(),
		password : Joi.string().min(8).required(),
		email : Joi.string().email(),
		role : Joi.string().valid(Morty.models.user.schema.obj.role.enum),
		postCount : Joi.number().integer(),
		deleted : Joi.boolean()
	}),
	update : Joi.object().keys({
		username : Joi.string().alphanum().min(3).max(30),
		password : Joi.string().min(8),
		email : Joi.string().email()
	})
};

module.exports = (server, prefix) => {

	/**
	 * Search for Users
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

		// Handle searching for deleted users
		// Only admins can see deleted users
		let deleted = req.user.isAdmin ? Boolean(req.query.deleted) : false;

		// TODO: Handle meta data
		// TODO: Handle errors
		return Morty.services.user.search({
			searchText : req.query.searchText,
			fields     : req.query.fields,
			sort       : req.query.sort,
			limit      : limit,
			skip       : skip,
			role       : req.query.role,
			deleted    : deleted
		}).then((result) => {
			res.header('X-Total-Count', result.count);
			// TODO: Link Headers
			res.json(result.users);
		});
	});

	/**
	 * Create new User
	 */
	server.post(`${prefix}/`, Morty.middleware.isAdmin, (req, res, next) => {
		const validation = Joi.validate(req.body, _schemas.create);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		return Morty.services.user.create(req.body).then((result) => {
			res.json(result);
		}).catch((err) => {
			// TODO: Handle errors better
			res.status(400);
			res.json(err);
		});
	});

	/**
	 * Find a single User by id
	 */
	server.get(`${prefix}/:id`, Morty.middleware.isLoggedIn, (req, res, next) => {
		const validation = Joi.validate(req.params.id, _schemas.id);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		return Morty.services.user.findById({
			id     : req.params.id,
			fields : req.query.fields
		}).then((result) => {
			// Ensure the user can view this user
			// If it's deleted, must be an Admin
			if(req.user.isAdmin || !result.deleted){
				res.json(result);
			} else{
				res.status(403);
				return res.json({
					message : 'Insufficient access to view this user.'
				});
			}
		}).catch((err) => {
			// TODO: Handle errors better
			res.status(400);
			res.json(err);
		});
	});

	/**
	 * Update a single User by id
	 * Supports partial updates through JSON Merge Patch (RFC 7396)
	 */
	server.patch(`${prefix}/:id`, Morty.middleware.isLoggedIn, (req, res, next) => {
		let validation = Joi.validate(req.params.id, _schemas.id);
		if(!validation.error){
			validation = Joi.validate(req.body.update, _schemas.update);
		}

		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		return Morty.services.user.findById({id : req.params.id}).then((result) => {
			if(result){
				// Ensure the user can update this user
				// Must be the Owner or an Admin
				// If it's deleted, must be an Admin
				if(req.user.isAdmin || (String(result.author) == req.user.id && !result.deleted)){
					return Morty.services.user.updateById(req.params.id, req.body).then((result) => {
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
	 * Deletes a single User by id
	 */
	server.del(`${prefix}/:id`, Morty.middleware.isAdmin, (req, res, next) => {
		const validation = Joi.validate(req.params.id, _schemas.id);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}
		// TODO: Support hard deletes
		return Morty.services.user.softDelete(req.params.id).then((result) => {
			res.json(result);
		}).catch((err) => {
			// TODO: Handle errors better
			res.status(400);
			return res.json(err);
		});
	});
};
