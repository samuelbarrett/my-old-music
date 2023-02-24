import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { login, getAuthorization, getData, getMusicAgeYears, getMusicAgeDays } from './index.js';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

router.get("/", function(req, res) {
	res.render('index');
});

router.get('/login', (req,res) => {
	login(req,res);
});

router.get('/signed-in', (req, res) => {
	getAuthorization(req, res);
});

router.get('/authd', async (req, res) =>  {
	await getData(req, res);
	res.render('results', {years: getMusicAgeYears(), days: getMusicAgeDays()});
});

export { router };