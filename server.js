import { app, port } from './app.js';

// listen on the specified port
app.listen(port, function() {
	console.log(`live at localhost:${port}`);
});