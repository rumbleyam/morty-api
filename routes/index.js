/**
 * Handles top level API actions
 */

var Joi = require('joi');

var _schemas = {
	register : Joi.object().keys({
		username : Joi.string().alphanum().min(3).max(30),
		password : Joi.string().min(8),
		email : Joi.string().email()
	}),
	login : Joi.object().keys({
		username : Joi.string().alphanum().min(3).max(30),
		password : Joi.string().min(8)
	})
};

module.exports = (server, prefix) => {
	/**
	 * Register an account
	 */
	server.post(`${prefix}/register`, Morty.middleware.isNotLoggedIn, (req, res, next) => {
		const validation = Joi.validate(req.body, _schemas.register);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		return Morty.services.authentication.register(req.body).then((result) => {
			res.json(result);
		}).catch((err) => {
			res.status(400);
			res.json(err);
		});
	});

	/**
	 * Login to an account
	 */
	server.post(`${prefix}/login`, Morty.middleware.isNotLoggedIn, (req, res, next) => {
		const validation = Joi.validate(req.body, _schemas.login);
		if(validation.error){
			res.status(400);
			return res.json(validation);
		}

		return Morty.services.authentication.login(req.body.username, req.body.password).then((result) => {
			res.json(result);
		}).catch((err) => {
			res.status(400);
			res.json(err);
		});
	});

	/**
	 * Test route that reports the user associated with the provided token
	 */
	server.get(`${prefix}/whoami`, Morty.middleware.isLoggedIn, (req, res, next) => {
		res.json(req.user);
	});
};
