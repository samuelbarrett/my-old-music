import path from 'path';

// replacement for __dirname constant from CommonJS, missing in ES Modules.
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const dev = process.env.NODE !== 'production';

export default {
	target: 'node',
	entry: './src/index.js',
	devtool: dev ? 'eval-cheap-module-source-map' : false,
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'public/dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: 'pre',
				use: ['source-map-loader'],
			}
		]
	}
};