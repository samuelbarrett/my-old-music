// router for the welcome/home page

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	res.sendFile('home.html', { root: __dirname});
});

export { router as welcomeRouter };