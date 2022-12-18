import path from 'path';
import { dirname } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 8000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

// listen on the specified port
app.listen(port, function() {
	console.log(`live at localhost:${port}`);
});