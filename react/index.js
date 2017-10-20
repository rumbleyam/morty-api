const clientConfig = require('./client.prod');
const restify = require('restify');

const outputPath = clientConfig.output.path;

const clientStats = require(`${Morty.path.compiledClient}/stats.json`);
const serverRender = require(`${Morty.path.compiledServer}/main.js`).default;

exports.enableServerSideRendering = (server) => {
	server.get(/\/static\/?.*/, restify.plugins.serveStatic({
		directory : outputPath,
		appendRequestPath : false,
		default : 'stats.json'
	}));

	server.get('/favicon.ico', restify.plugins.serveStatic({
		directory : Morty.path.react,
		appendRequestPath : false,
		default : 'favicon.ico'
	}));

	server.get(/.*/, serverRender({clientStats, outputPath}));
};
