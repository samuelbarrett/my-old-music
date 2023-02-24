import { dirname } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import web from './web.json' assert { type: 'json'};
import { router } from './src/router.js';

const app = express();
const port = process.env.PORT || 8000;
const origin = `${web.ORIGIN}:${web.PORT}`;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/', router);

app.listen(port, function() {
	console.log(`live at localhost:${port}`);
});