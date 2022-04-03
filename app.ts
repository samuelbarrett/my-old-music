import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import web from './web.json';

import { welcomeRouter } from './components/welcome/welcomeRoute';
import { spotifyRouter } from './components/spotify/spotifyRoute';
import { userDataRouter } from './components/userdata/userDataRoute';

const origin = `${web.ORIGIN}${web.PORT}`;
const app = express();

app.use(express.static(__dirname + '/components'))	// allow serving of content (everything within public folder)
	.use(cookieParser())
	.use(cors( { origin: origin } ))
	
// connect to Express Router objects
app.use('/', welcomeRouter)
	.use('/spotify', spotifyRouter)
	.use('/userdata', userDataRouter);

export { app };