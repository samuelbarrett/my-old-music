import express from 'express';

const welcomeRouter = express.Router();

welcomeRouter.get('/', (req, res) => {
	res.sendFile('home.html', { root: __dirname});
});

export { welcomeRouter };