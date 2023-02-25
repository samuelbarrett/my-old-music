import express from 'express';
import web from './web.json' assert { type: 'json'};
import { router } from './src/router.js';

const app = express();
const port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/', router);

app.listen(port, function() {
	console.log(`live at localhost:${port}`);
});