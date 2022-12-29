import { dirname } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import web from './web.json' assert { type: 'json'};
import { router } from './src/router.js';

const app = express();
const port = process.env.PORT || 8000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const origin = `${web.ORIGIN}:${web.PORT}`;

app.use(express.static(__dirname + '/public'));

app.use('/', router);

export { app, port };