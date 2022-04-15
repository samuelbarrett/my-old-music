// user data page, after receiving authorization and user data

import express from 'express';
import { averageAgeInDays } from './songsController';

const router = express.Router();

router.get('/', (req, res) => {
	let days: number = averageAgeInDays();
	res.send(`The average song in your library is ${days} days old!`);
});

export { router as userDataRouter };