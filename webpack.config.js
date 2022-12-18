import path from 'path';

// replacement for __dirname constant from CommonJS, missing in ES Modules.
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devServer: {
		static: path.join(__dirname, 'public'),
		port: 8000
	}
}