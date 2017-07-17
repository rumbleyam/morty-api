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
		root : __dirname,
		lib  : __dirname + '/lib',
		services : __dirname + '/services'
	}
};

/**
 * Requires
 */
var fs = require('fs');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

function initializeRoutes(server){
	return new Promise((resolve, reject) => {
		fs.readdir(Morty.path.root + '/routes', (err, routes) => {
			// TODO: Make this recursive to support folders
			// Load all routes
			_.each(routes, (route) => {
				if(route.endsWith('.js')){
					require(`${Morty.path.root}/routes/${route}`)(server, route == 'index.js' ? '' : `/${route.split('.js')[0]}`);
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

	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.dateParser());
	server.use(restify.queryParser());
	server.use(restify.gzipResponse());
	server.use(restify.bodyParser());
	server.use(restify.CORS());
	server.use(restify.throttle({
		burst: 100,
		rate: 50,
		ip: true,
	}));

	Morty.middleware = require(Morty.path.root + '/middleware');

	attachToNamespace('models')
	.then(_.partial(initializeRoutes, server))
	.then(_.partial(attachToNamespace, 'services'))
	.then(() => {
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
