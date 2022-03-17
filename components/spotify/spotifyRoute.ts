import express from 'express';

const spotifyRouter = express.Router();

spotifyRouter.get('/spotify', (req, res) => {
	res.send('okay here is spotify');
});

export { spotifyRouter };