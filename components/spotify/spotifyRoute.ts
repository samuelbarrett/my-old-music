// router for the spotify component

import express from 'express';
import { getAuthorization, login, getUserSongsData } from './spotifyApi';
import web from '../../web.json';

const router = express.Router();

router.get('/', (req, res) => {
	login(req, res);
});

router.get('/signed-in', (req, res) => {
	getAuthorization(req, res);
});

router.get(`/authd`, (req, res) => {
	getUserSongsData(req, res);
	res.redirect(`${web.ORIGIN}${web.PORT}/${web.USERDATA_BASE_ENDPOINT}`);
});

export { router as spotifyRouter };