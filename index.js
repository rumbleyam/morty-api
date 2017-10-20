/**
* Globals
*/
global._ = require('underscore');
global.config = require('./config');
global.moment = require('moment');
global.mongoose = require('mongoose');
global.Promise = require('bluebird');

/**
* Promise configuration
*/
Promise.onPossiblyUnhandledRejection((reason) => {
	console.error(reason);
});
mongoose.Promise = Promise;

/**
 * Setup Morty namespace
 */
global.Morty = {
	path : {
		root           : `${__dirname}`,
		lib            : `${__dirname}/lib`,
		services       : `${__dirname}/services`,
		webpack        : `${__dirname}/webpack`,
		react          : `${__dirname}/react`,
		compiledClient : `${__dirname}/react/buildClient`,
		compiledServer : `${__dirname}/react/buildServer`
	}
};

/**
 * Requires
 */
var fs = require('fs');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const corsMiddleware = require('restify-cors-middleware');
require('babel-polyfill');

function initializeRoutes(server){
	return new Promise((resolve, reject) => {
		fs.readdir(Morty.path.root + '/routes', (err, routes) => {
			// TODO: Make this recursive to support folders
			// Load all routes
			_.each(routes, (route) => {
				if(route.endsWith('.js')){
					require(`${Morty.path.root}/routes/${route}`)(server, route == 'index.js' ? '' : `/api/${route.split('.js')[0]}`);
				}
			});
			resolve();
		});
	});
}

/**
 * Initializes the server
 * @return {void}
 */
function startAPI(){
	// Connect to database
	mongoose.connect(config.mongoDBURL);

	var restify = require('restify');

	let serverOptions = {
		name : config.serverName
	};

	// Setup HTTPS
	if(_.isObject(config.https) && fs.existsSync(config.https.certificate) && fs.existsSync(config.https.key)){
		serverOptions.certificate = fs.readFileSync(config.https.certificate);
		serverOptions.key         = fs.readFileSync(config.https.key);
	}

	let server = restify.createServer(serverOptions);

	server.use(restify.plugins.acceptParser(server.acceptable));
	server.use(restify.plugins.dateParser());
	server.use(restify.plugins.queryParser());
	server.use(restify.plugins.gzipResponse());
	server.use(restify.plugins.bodyParser());
	server.use(restify.plugins.throttle({
		burst: 100,
		rate: 50,
		ip: true,
	}));

	// Handle CORS
	// TODO: Read parameters from config
	const cors = corsMiddleware({
		origins: ['*'],
		allowHeaders: ['Authorization'],
		exposeHeaders: ['X-Total-Count']
	});
	server.pre(cors.preflight);
	server.use(cors.actual);

	// Break comma separated values in query string into arrays
	// TODO: Evaluate performance and consider making this on demand
	server.use((req, res, next) => {
		if(req.query){
			var ownKeys = Object.getOwnPropertyNames(req.query);
			_.each(ownKeys, function(key){
				if(typeof req.query[key] == 'string' && req.query[key].includes(',')){
					req.query[key] = req.query[key].split(',');
				}
			});
		}
		next();
	});

	Morty.middleware = require(Morty.path.root + '/middleware');

	attachToNamespace('models')
	.then(_.partial(initializeRoutes, server))
	.then(_.partial(attachToNamespace, 'services'))
	.then(() => {
		require('./react').enableServerSideRendering(server);
		server.listen(config.port, () => {
			console.log(`${server.name} listening at ${server.url}`);
		});
	});
}

function attachToNamespace(directory){
	return new Promise((resolve, reject) => {
		fs.readdir(Morty.path.root + `/${directory}`, (err, files) => {
			// Load all files
			Morty[directory] = {};
			_.each(files, (file) => {
				if(file.endsWith('.js')){
					Morty[directory][file.split('.js')[0]] = require(`${Morty.path.root}/${directory}/${file}`);
				}
			});
			resolve();
		});
	});
}

(function(){
	if (cluster.isMaster && config.enableClustering) {
		// Create a worker for each thread
		for (let i = 0; i < numCPUs; i++) {
			cluster.fork();
		}

		cluster.on('online', (worker) => {
			console.log(`Worker ${worker.process.pid} online`);
		});

		cluster.on('exit', (worker, code, signal) => {
			console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
			console.log('Creating replacement...');
			cluster.fork();
		});
	} else {
		startAPI();
	}
})();
