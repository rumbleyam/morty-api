/**
 * User Service
 * Manages actions related to Users
 */

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
 * @return {Promise}
 */
exports.findById = (params) => {
	return new Promise((resolve, reject) => {
		let search = Morty.models.user.findById(params.id);

		if(params.fields){
			let fields = '';
			if(_.isString(params.fields)){
				fields = params.fields;
			} else if(_.isArray(params.fields)){
				fields = params.fields.join(' ');
			}

			// Ensure that we won't show password hashes
			if(fields.includes('password')){
				fields = fields.replace('password', '');
			}

			search.select(fields);
		} else{
			// Exclude passwords from being returned
			search.select('-password');
		}

		return search.exec().then((user) => {
			resolve(user);
		});
	});
};

/**
 * Search for users matching provided dictionary
 * @return {Promise}
 */
exports.search = (params) => {

	return new Promise((resolve, reject) => {
		let query = {};

		if(params.searchText){
			query.$text = {$search : params.searchText};
		}

		if(_.isString(params.role)){
			query.role = params.role;
		} else if(_.isArray(params.role)){
			query.role = {$in : params.role};
		}

		query.deleted = params.deleted || false;

		let search = Morty.models.user.find(query);
		search.skip(params.skip).limit(params.limit);

		if(params.fields){
			let fields = '';
			if(_.isString(params.fields)){
				fields = params.fields;
			} else if(_.isArray(params.fields)){
				fields = params.fields.join(' ');
			}

			// Ensure that we won't show password hashes
			if(fields.includes('password')){
				fields = fields.replace('password', '');
			}

			search.select(fields);
		} else{
			// Exclude passwords from being returned
			search.select('-password');
		}

		if(_.isString(params.sort)){
			search.sort(params.sort);
		} else if(_.isArray(params.sort)){
			search.sort(params.sort.join(' '));
		}

		return Morty.models.user.count(query).then((count) => {
			return search.exec().then((users) => {
				return resolve({
					users : users,
					count : count
				});
			});
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
		return Morty.models.user.deleteOne({_id : id}).exec().then(() => {
			resolve();
		});
	});
};
