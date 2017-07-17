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
 * @param  {Object} params Find parameters
 * @return {Promise}
 */
exports.findById = (params) => {
	return new Promise((resolve, reject) => {
		let search = Morty.models.post.findById(params.id);

		if(params.fields){
			let fields = '';
			if(_.isString(params.fields)){
				fields = params.fields;
			} else if(_.isArray(params.fields)){
				fields = params.fields.join(' ');
			}

			search.select(fields);
		}

		return search.exec().then((post) => {
			resolve(post);
		});
	});
};

/**
 * Search for posts matching provided dictionary
 * @param  {Object} params Search parameters
 * @return {Promise}
 */
exports.search = (params) => {
	return new Promise((resolve, reject) => {
		let query = {};

		if(params.searchText){
			query.$text = {$search : params.searchText};
		}

		if(_.isString(params.categories)){
			query.categories = params.categories;
		} else if(_.isArray(params.categories)){
			query.categories = {$in : params.categories};
		}

		if(_.isString(params.tags)){
			query.tags = params.tags;
		} else if(_.isArray(params.tags)){
			query.tags = {$in : params.tags};
		}

		if(params.template){
			query.template = params.template;
		}

		query.published = !params.unpublished;

		query.deleted = params.deleted || false;

		let search = Morty.models.post.find(query);
		search.skip(params.skip).limit(params.limit);

		if(params.fields){
			let fields = '';
			if(_.isString(params.fields)){
				fields = params.fields;
			} else if(_.isArray(params.fields)){
				fields = params.fields.join(' ');
			}

			search.select(fields);
		}

		if(_.isString(params.sort)){
			search.sort(params.sort);
		} else if(_.isArray(params.sort)){
			search.sort(params.sort.join(' '));
		}

		return Morty.models.post.count(query).then((count) => {
			return search.exec().then((posts) => {
				return resolve({
					posts : posts,
					count : count
				});
			});
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
