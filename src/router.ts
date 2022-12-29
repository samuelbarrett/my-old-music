import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { login } from './index.js';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

router.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/login', (req,res) => {
	login(req,res);
});

export { router };