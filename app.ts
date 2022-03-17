import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import web from './web.json';

import { welcomeRouter } from './components/welcome/welcomeRoute';
import { spotifyRouter } from './components/spotify/spotifyRoute';

const origin = `http://localhost:${web.port}`;
const app = express();

app.use(express.static('./'))	// allow serving of content (everything within public folder)
	.use(cookieParser())	// and use of cookieParser tool
	.use(cors( { origin: origin } ))
	
app.use('/', welcomeRouter);
app.use('/spotify', spotifyRouter);

export { app };