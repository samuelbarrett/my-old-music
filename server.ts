import { app } from './app';
import web from './web.json';

app.listen(web.PORT, () => {
	console.log(`We're live at localhost:${web.PORT}!`);
});