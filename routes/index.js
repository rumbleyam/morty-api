/**
 * Handles top level API actions
 */

module.exports = (server, prefix) => {
	/**
	 * Register an account
	 */
	server.post(`${prefix}/register`, Morty.middleware.isNotLoggedIn, (req, res, next) => {
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
