/**
 * User Route
 * Handles requests and forwards to the User Service
 */

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
	 * Find a single User by id
	 */
	server.get(`${prefix}/:id`, (req, res, next) => {
		// TODO: Validate request
		// TODO: Handle errors
		return Morty.services.user.findById(req.params.id).then((result) => {
			res.json(result);
		});
	});

	/**
	 * Update a single User by id
	 * Supports partial updates through JSON Merge Patch (RFC 7396)
	 */
	server.patch(`${prefix}/:id`, (req, res, next) => {
		// TODO: Validate request
		// TODO: Handle errors
		return Morty.services.user.update(req.params.id, req.body).then((result) => {
			res.json(result);
		});
	});

	/**
	 * Deletes a single User by id
	 */
	server.del(`${prefix}/:id`, (req, res, next) => {
		// TODO: Validate request
		// TODO: Support hard deletes
		// TODO: Handle errors
		return Morty.services.user.softDelete(req.params.id).then((result) => {
			res.json(result);
		});
	});
};
