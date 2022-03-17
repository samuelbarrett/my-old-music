// requests to Spotify API through spotify-web-api-node library

let spotifyWebApi = require('spotify-web-api-node');
import { read } from 'fs';
import auth from '../../auth.json';

const scopes = 'user-library-read';
const stateKey = 'spotify-auth-state';

const spotify = new spotifyWebApi({
	clientId: auth.CLIENT_ID,
	clientSecret: auth.SECRET,
	redirectUri: auth.REDIRECT_URI
});

// request user authentication from Spotify Accounts Service
let login = function(req: any, res: any) {
	
};

// generate a random string of defined length
let getRandomString = function(length: Number) {
	let randomString = '';
	let validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		randomString += validChars.charAt( Math.floor(Math.random() * validChars.length) );
	}
	return randomString;
}

export { spotify };

