const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const res = p => path.resolve(__dirname, p);

const externals = fs
.readdirSync(res('../node_modules'))
.filter(
	x =>
	!/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/.test(
		x
	)
)
.reduce((externals, mod) => {
	externals[mod] = `commonjs ${mod}`;
	return externals;
}, {});

module.exports = {
	name: 'server',
	target: 'node',
	devtool: 'source-map',
	entry: ['fetch-everywhere', res('./render.js')],
	externals,
	output: {
		path: res('./buildServer'),
		filename: '[name].js',
		libraryTarget: 'commonjs2'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: {
					loader: 'css-loader/locals',
					options: {
						modules: true,
						localIdentName: '[name]__[local]--[hash:base64:5]'
					}
				}
			}
		]
	},
	resolve: {
		extensions: ['.js', '.css']
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		}),

		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		})
	]
};
