// router for the spotify component

import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	res.send('okay here is spotify');
});

export { router as spotifyRouter };