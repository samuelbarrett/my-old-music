import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { login, getAuthorization, getData } from './index.js';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

router.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/login', (req,res) => {
	login(req,res);
});

router.get('/signed-in', (req, res) => {
	getAuthorization(req, res);
});

router.get('/authd', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/results.html'));
	getData(req, res);
});

export { router };