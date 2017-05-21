/**
 * Post Service
 * Manages actions related to Posts
 */

/**
 * Create a new Post
 * @param  {Object} doc Document to create Post from
 * @return {Promise}
 */
exports.create = (doc) => {
	return new Promise((resolve, reject) => {
		var post = new Morty.models.post(doc);
		return post.save().then(() => {
			resolve(post);
		});
	});
};

/**
 * Find a Post by id
 * @param  {String} id Post's id
 * @return {Promise}
 */
exports.findById = (id) => {
	return new Promise((resolve, reject) => {
		return Morty.models.post.findById(id).exec().then((post) => {
			resolve(post);
		});
	});
};

/**
 * Search for posts matching provided dictionary
 * TODO: Query
 * TODO: Pagination
 * @return {Promise}
 */
exports.search = () => {
	return new Promise((resolve, reject) => {
		return Morty.models.post.find().exec().then((posts) => {
			resolve(posts);
		});
	});
};

/**
 * Update a Post with provided id and update payload
 * Supports partial updates
 * @param  {String} id     Post's id
 * @param  {Object} update Update payload
 * @return {Promise}
 */
exports.updateById = (id, update) => {
	return new Promise((resolve, reject) => {
		return Morty.models.post.findOneAndUpdate({_id : id}, update, {new : true}).exec().then((post) => {
			resolve(post);
		});
	});
};

/**
 * Flags a Post as deleted in the database
 * @param  {String} id Post's id
 * @return {Promise}
 */
exports.softDeleteById = (id) => {
	return exports.updateById(id, {deleted : true});
};

/**
 * Removes a Post from the database
 * @param  {String} id Post's id
 * @return {Promise}
 */
exports.hardDeleteById = (id) => {
	return new Promise((resolve, reject) => {
		return Morty.models.post.deleteOne({_id : id}).exec().then(() => {
			resolve();
		});
	});
};
