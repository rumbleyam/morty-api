/**
 * Post Route
 * Handles requests and forwards to the Post Service
 */

var Joi = require('joi');

var _schemas = {
	id : Joi.string(),
	create : Joi.object().keys({
		author : Joi.string(),
		title : Joi.string().required(),
		description : Joi.string().required(),
		content : Joi.string().required(),
		categories : Joi.array().items(Joi.string()),
		tags : Joi.array().items(Joi.string()),
		template : Joi.string(),
		published : Joi.string()
	}),
	update : Joi.object().keys({
		author : Joi.string(),
		title : Joi.string().required(),
		description : Joi.string().required(),
		content : Joi.string().required(),
		categories : Joi.array().items(Joi.string()),
		tags : Joi.array().items(Joi.string()),
		template : Joi.string(),
		published : Joi.string(),
		deleted : Joi.boolean()
	})
};

module.exports = (server, prefix) => {
	/**
	 * Search for Posts
	 */
	server.get(`${prefix}/`, (req, res, next) => {
		// TODO: Validate request
		// TODO: Build query
		// TODO: Handle meta data
		// TODO: Handle errors
		return Morty.services.post.search().then((result) => {
			res.json(result);
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
	 * Find a single Post by id
	 */
	server.get(`${prefix}/:id`, (req, res, next) => {
		const validation = Joi.validate(req.params.id, _schemas.id);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		return Morty.services.post.findById(req.params.id).then((result) => {
			if(result){
				// Ensure the user can view this post
				// If it isn't published, must be the post Owner, an Editor, or an Admin
				// If it's deleted, must be an Admin
				if(
					req.user.isAdmin ||
					(req.user.isEditor && !result.deleted) ||
					(req.user.isAuthor && String(result.author) == req.user.id && !result.deleted)
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
			validation = Joi.validate(req.body.update, _schemas.update);
		}

		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		return Morty.services.post.findById(req.params.id).then((result) => {
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
