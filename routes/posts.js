/**
 * Post Route
 * Handles requests and forwards to the Post Service
 */

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
	server.post(`${prefix}/`, (req, res, next) => {
		// TODO: Validate request
		// TODO: Handle errors
		return Morty.services.post.create(req.body).then((result) => {
			res.json(result);
		});
	});

	/**
	 * Find a single Post by id
	 */
	server.get(`${prefix}/:id`, (req, res, next) => {
		// TODO: Validate request
		// TODO: Handle errors
		return Morty.services.post.findById(req.params.id).then((result) => {
			res.json(result);
		});
	});

	/**
	 * Update a single Post by id
	 * Supports partial updates through JSON Merge Patch (RFC 7396)
	 */
	server.patch(`${prefix}/:id`, (req, res, next) => {
		// TODO: Validate request
		// TODO: Handle errors
		return Morty.services.post.update(req.params.id, req.body).then((result) => {
			res.json(result);
		});
	});

	/**
	 * Deletes a single Post by id
	 */
	server.del(`${prefix}/:id`, (req, res, next) => {
		// TODO: Validate request
		// TODO: Support hard deletes
		// TODO: Handle errors
		return Morty.services.post.softDelete(req.params.id).then((result) => {
			res.json(result);
		});
	});
};
