import React from 'react';
import ReactDOM from 'react-dom/server';
import {Provider} from 'react-redux';
import {flushChunkNames} from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import configureStore from './configureStore';
import App from './src/components/App';

import {SheetsRegistry} from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {create} from 'jss';
import preset from 'jss-preset-default';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import createGenerateClassName from 'material-ui/styles/createGenerateClassName';
import {deepPurple, indigo} from 'material-ui/colors';

export default ({ clientStats }) => async (req, res, next) => {
	const store = await configureStore(req, res);
	if (!store) return; // no store means redirect was already served

	// Create a sheetsRegistry instance.
	const sheetsRegistry = new SheetsRegistry();

	// Create a theme instance.
	const theme = createMuiTheme({
		palette: {
			primary: deepPurple,
			secondary: indigo,
			type: 'light',
		}
	});

	// Configure JSS
	const jss = create(preset());
	jss.options.createGenerateClassName = createGenerateClassName;

	const app = createApp(App, store, {sheetsRegistry, theme, jss});
	const appString = ReactDOM.renderToString(app);
	const stateObject = store.getState();
	const stateJson = JSON.stringify(stateObject);
	const chunkNames = flushChunkNames();
	const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });

	var body = `<!doctype html>
		<html>
			<head>
				<meta charset="utf-8">
				<title>${stateObject.title}</title>
				<style>
					html, body{
						margin: 0px; padding: 0px
					}
					body{
						height: 100vh;
					}
					#root{
						height: 100%;
					}
					.masonry{
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-content: stretch;
						width: 100%;
						margin: auto;
					}
					.column{
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						align-content: stretch;
						flex-grow: 1;
					}
				</style>
				${styles}
				<link rel="stylesheet prefetch" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
			</head>
			<body>
				<script>window.REDUX_STATE = ${stateJson}</script>
				<div id="root">${appString}</div>
				${cssHash}
				<style id="jss-server-side">${sheetsRegistry.toString()}</style>
				<script type='text/javascript' src='/static/vendor.js'></script>
				${js}
			</body>
		</html>
	`;
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.write(body);
	return res.end();
};

const createApp = (App, store, materialUiOptions) => {
	return (
		<Provider store={store}>
			<JssProvider registry={materialUiOptions.sheetsRegistry} jss={materialUiOptions.jss}>
				<MuiThemeProvider theme={materialUiOptions.theme} sheetsManager={new Map()}>
					<App />
				</MuiThemeProvider>
			</JssProvider>
		</Provider>
	);
};
