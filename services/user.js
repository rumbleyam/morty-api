/**
 * User Service
 * Manages actions related to Users
 */
var Joi = require('joi');

var _schemas = {
	id : Joi.string(),
	update : Joi.object().keys({
		username : Joi.string().alphanum().min(3).max(30),
		password : Joi.string().min(8),
		email : Joi.string().email()
	})
};

/**
 * Create a new User
 * @param  {Object} doc Document to create User from
 * @return {Promise}
 */
exports.create = (doc) => {
	return new Promise(async (resolve, reject) => {
		try {
			if(doc.password){
				// Hash the password
				let hash = await Morty.services.authentication.generatePasswordHash(doc.password);
				doc.password = hash;
			}
			var user = new Morty.models.user(doc);
			return user.save().then(() => {
				resolve(user);
			}).catch(reject);
		} catch(error){
			reject(error);
		}
	});
};

/**
 * Find a User by id
 * @param  {String} id User's id
 * @return {Promise}
 */
exports.findById = (id) => {
	return new Promise((resolve, reject) => {
		const validation = Joi.validate(id, _schemas.id);
		if(validation.error){
			return reject(validation);
		}
		return Morty.models.user.findById(id).exec().then((user) => {
			resolve(user);
		});
	});
};

/**
 * Search for users matching provided dictionary
 * TODO: Query
 * TODO: Pagination
 * @return {Promise}
 */
exports.search = () => {
	return new Promise((resolve, reject) => {
		return Morty.models.user.find().exec().then((users) => {
			return resolve(users);
		});
	});
};

/**
 * Update a User with provided id and update payload
 * Supports partial updates
 * @param  {String} id     User's id
 * @param  {Object} update Update payload
 * @return {Promise}
 */
exports.updateById = (id, update) => {
	return new Promise(async (resolve, reject) => {
		var validation = Joi.validate(id, _schemas.id);
		if(validation.error){
			return reject(validation);
		}
		validation = Joi.validate(update, _schemas.update);
		if(validation.error){
			return reject(validation);
		}

		try {
			if(update.password){
				// Hash the password
				let hash = await Morty.services.authentication.generatePasswordHash(update.password);
				update.password = hash;
			}
			return Morty.models.user.findOneAndUpdate({_id : id}, update, {new : true}).exec().then((user) => {
				resolve(user);
			});
		} catch(error){
			reject(error);
		}
	});
};

/**
 * Flags a User as deleted in the database
 * @param  {String} id User's id
 * @return {Promise}
 */
exports.softDeleteById = (id) => {
	return new Promise((resolve, reject) => {
		var validation = Joi.validate(id, _schemas.id);
		if(validation.error){
			return reject(validation);
		}
		return exports.updateById(id, {deleted : true});
	});
};

/**
 * Removes a User from the database
 * @param  {String} id User's id
 * @return {Promise}
 */
exports.hardDeleteById = (id) => {
	return new Promise((resolve, reject) => {
		var validation = Joi.validate(id, _schemas.id);
		if(validation.error){
			return reject(validation);
		}
		return Morty.models.user.deleteOne({_id : id}).exec().then(() => {
			resolve();
		});
	});
};
