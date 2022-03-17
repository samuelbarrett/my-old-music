import express from 'express';

const welcomeRouter = express.Router();

welcomeRouter.get('/', (req, res) => {
	res.send('welcome to My Old Music');
});

export { welcomeRouter };