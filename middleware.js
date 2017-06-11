/**
 * Route Middleware
 */

/**
 * Looks up a user, if they exist
 * Will error out if provided token is bad or the associated user does not exist
 */
exports.lookupUser = (req, res, next) => {
	var token = req.headers.Authorization || req.query.token || (req.body ? req.body.token : null);
	if(token){
		Morty.services.authentication.verifyToken(token).then((decoded) => {
			if(decoded.id){
				Morty.services.user.findById(decoded.id).then((user) => {
					req.user = user;
					next();
				});
			} else{
				res.status(400);
				res.json({
					message : 'Invalid authorization token.'
				});
			}
		}).catch(() => {
			res.status(400);
			res.json({
				message : 'Invalid authorization token.'
			});
		});
	} else {
		next();
	}
};

/**
 * Requires that a user be logged in to access a resource
 */
exports.isLoggedIn = (req, res, next) => {
	exports.lookupUser(req, res, function(){
		if(!req.user){
			res.status(401);
			res.json({
				message : 'This endpoint requires authentication.'
			});
		} else{
			next();
		}
	});
};

/**
 * Requires that a user not be logged in to access a resource
 */
exports.isNotLoggedIn = (req, res, next) => {
	exports.lookupUser(req, res, function(){
		if(req.user){
			res.status(403);
			res.json({
				message : 'This endpoint is not accessible by authenticated users.'
			});
		} else{
			next();
		}
	});
};

/**
 * Requires that a user be an admin to access a resource
 */
exports.isAdmin = (req, res, next) => {
	exports.lookupUser(req, res, function(){
		if(!req.user){
			res.status(401);
			res.json({
				message : 'This endpoint requires authentication.'
			});
		} else if(req.user.roles !== 'admin'){
			res.status(403);
			res.json({
				message : 'This endpoint is not accessible by your user role.'
			});
		} else{
			next();
		}
	});
};

/**
 * Requires that a user be at least an author to access a resource
 */
exports.isAuthor = (req, res, next) => {
	exports.lookupUser(req, res, function(){
		if(!req.user){
			res.status(401);
			res.json({
				message : 'This endpoint requires authentication.'
			});
		} else if(req.user.isAdmin || req.user.isEditor || req.user.isAuthor){
			res.status(403);
			res.json({
				message : 'This endpoint is not accessible by your user role.'
			});
		} else{
			next();
		}
	});
};
