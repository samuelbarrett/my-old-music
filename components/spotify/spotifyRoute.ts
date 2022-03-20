// router for the spotify component

import express from 'express';
import { getAuthorization, login } from './spotifyApi';
import web from '../../web.json';

const router = express.Router();

router.get('/', (req, res) => {
	login(req, res);
});

router.get('signed-in/', (req, res) => {
	getAuthorization(req, res);
});

router.get(`${web.AUTHORIZATION_SUCCESS_ENDPOINT}`, (req, res) => {
	
});

export { router as spotifyRouter };