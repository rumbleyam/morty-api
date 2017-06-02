/**
 * User Route
 * Handles requests and forwards to the User Service
 */

var Joi = require('joi');

var _schemas = {
	id : Joi.string(),
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
	server.get(`${prefix}/`, (req, res, next) => {
		// TODO: Validate request
		// TODO: Build query
		// TODO: Handle meta data
		// TODO: Handle errors
		return Morty.services.user.search().then((result) => {
			res.json(result);
		});
	});

	/**
	 * Create new User
	 */
	server.post(`${prefix}/`, (req, res, next) => {
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
	server.get(`${prefix}/:id`, (req, res, next) => {
		const validation = Joi.validate(req.params.id, _schemas.id);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		return Morty.services.user.findById(req.params.id).then((result) => {
			res.json(result);
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
	server.patch(`${prefix}/:id`, (req, res, next) => {
		var validation = Joi.validate(req.params.id, _schemas.id);
		if(!validation.error){
			validation = Joi.validate(req.body.update, _schemas.update);
		}

		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		return Morty.services.user.update(req.params.id, req.body).then((result) => {
			res.json(result);
		}).catch((err) => {
			// TODO: Handle errors better
			res.status(400);
			return res.json(err);
		});
	});

	/**
	 * Deletes a single User by id
	 */
	server.del(`${prefix}/:id`, (req, res, next) => {
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
