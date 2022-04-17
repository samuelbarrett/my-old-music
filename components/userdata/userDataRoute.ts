// user data page, after receiving authorization and user data

import { ECDH } from 'crypto';
import express from 'express';
import { averageAgeInDays } from './songsController';

const router = express.Router();

router.get('/', (req, res) => {
	try {
		let days: number = averageAgeInDays();
		res.send(`The average song in your library is ${days} days old!`);
	} catch (ex: any) {
		res.send(ex.getMessage());
	}
});

export { router as userDataRouter };