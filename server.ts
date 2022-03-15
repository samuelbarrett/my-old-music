import { app } from './app';
import web from './web.json';

app.listen(web.port, () => {
	console.log(`We're live at localhost:${web.port}!`);
});