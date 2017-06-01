/**
 * Authentication Service
 * Manages actions related to Authentication
 */

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var Joi = require('joi');

var _schemas = {
	login : Joi.object().keys({
		username : Joi.string().alphanum().min(3).max(30),
		password : Joi.string().min(8)
	}),
	register : Joi.object().keys({
		username : Joi.string().alphanum().min(3).max(30).required(),
		password : Joi.string().min(8).required(),
		email : Joi.string().email()
	})
};

/**
 * Generates a token for a provided payload
 * @param  {Object} payload Payload to sign
 * @return {Promise}
 */
exports.generateToken = (payload) => {
	return new Promise((resolve, reject) => {
		// Sign payload
		jwt.sign(payload, config.tokenSecret, {
			algorithm : config.tokenAlgorithm,
			expiresIn : config.tokenExpiry
		}, (err, token) => {
			if(err || !token){
				reject(err);
			} else{
				resolve(token);
			}
		});
	});
};

/**
 * Verifies a token
 * @param  {String} token Token to verify
 * @return {Promise}
 */
exports.verifyToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.tokenSecret, {algorithm : config.tokenAlgorithm}, (err, decoded) => {
			if(err || !decoded){
				reject(err);
			} else{
				resolve(decoded);
			}
		});
	});
};

/**
 * Generates a password hash using bcrypt
 * @param  {String} password Password to hash
 * @return {Promise}
 */
exports.generatePasswordHash = (password) => {
	return bcrypt.hash(password, config.bcryptSaltRounds);
};

/**
 * Compares a password with a generated hash
 * @param  {String} password Password to compare
 * @param  {String} hash     Hash to compare
 * @return {Promise}
 */
exports.comparePasswordtoHash = (password, hash) => {
	return bcrypt.compare(password, hash);
};

/**
 * Logs a user in with the provided username and password
 * @param  {String} username User's username
 * @param  {String} password User's password
 * @return {Promise}
 */
exports.login = (username, password) => {
	return new Promise((resolve, reject) => {
		const validation = Joi.validate({
			username : username,
			password : password
		}, _schemas.login);
		if(validation.error){
			return reject(validation);
		}

		// Check that we have a user with the specified username
		return mongoose.model('user').findOne({
			username : username,
			deleted  : false
		}).then((user) => {
			if(!user){
				reject();
			} else{
				// Compare the provided password to the user's hash
				return exports.comparePasswordtoHash(password, user.password).then(() => {
					// Generate a token
					return exports.generateToken({
						id       : user.id,
						username : user.username,
						roles    : user.roles
					}).then((token) => {
						resolve({
							token : token
						});
					});
				});
			}
		}).catch((err) => {
			reject(err);
		});
	});
};

/**
 * Register a new User
 * Ensures only a username, email, and password are present
 * @param  {Object} doc Document to create User from
 * @return {Promise}
 */
exports.register = (doc) => {
	return new Promise((resolve, reject) => {
		const validation = Joi.validate(doc, _schemas.register);
		if(validation.error){
			return reject(validation);
		}

		return Morty.models.user.create(doc).then(resolve).catch(reject);
	});
};
