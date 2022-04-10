// requests to Spotify API through spotify-web-api-node library

let spotifyWebApi = require('spotify-web-api-node');
import { query } from 'express';
import { URLSearchParams } from 'url';
import auth from '../../auth.json';
import web from '../../web.json';
import { addSongs, listSongs, countSongs } from '../userdata/songsController';

const scopes = 'user-library-read';
const stateKey = 'spotify-auth-state';
let state: string;

const spotify = new spotifyWebApi({
	clientId: auth.CLIENT_ID,
	clientSecret: auth.SECRET,
	redirectUri: web.REDIRECT_SIGNEDIN
});

// request user authentication from Spotify Accounts Service
let login = function(req: any, res: any) {
	state = getRandomString(16);

	res.cookie(stateKey, state);

	res.redirect('https://accounts.spotify.com/authorize?' + new URLSearchParams([
		["response_type", "code"],
		["client_id", encodeURIComponent(auth.CLIENT_ID)],
		["scope", encodeURIComponent(scopes)],
		["redirect_uri", web.REDIRECT_SIGNEDIN],
		["state", state]
	]).toString());
};

let getAuthorization = function(req: any, res: any) {
	let returnState = req.query.state || null;
	let code = req.query.code || null;
	let error = req.query.error || null;

	if (returnState === state) {
		if (code !== null) {
			spotify.authorizationCodeGrant(code).then(
				function(data: any) {
				  	console.log('The token expires in ' + data.body['expires_in']);
				  	console.log('The access token is ' + data.body['access_token']);
				  	console.log('The refresh token is ' + data.body['refresh_token']);
			  
				  	spotify.setAccessToken(data.body['access_token']);
				  	spotify.setRefreshToken(data.body['refresh_token']);
					
					res.redirect(`${web.ORIGIN}${web.PORT}/${web.SPOTIFY_BASE_ENDPOINT}${web.SPOTIFY_AUTH_SUCCESS_ENDPOINT}`);
				},
				function(err: any) {
				  console.log('Something went wrong!', err);
				}
			)
		}
	} else {
		console.log(error);
	}
};

// request from user library
let getUserSongsData = async function(req: any, res: any) {
	const numSongsPerRequest = 50; // maximum 50 songs, per Spotify
	let offset = 0;
	let endOfTracks = false;

	while (!endOfTracks) {
		try {
			await spotify.getMySavedTracks({
				limit: numSongsPerRequest,
				offset: offset
			}).then( function(data: any) {

				if (data.statusCode === 200) {
					addSongs(data.body.items);
					console.log(`SONG COUNT = ${countSongs()}`)

					if (data.body.total < numSongsPerRequest) {
						endOfTracks = true;
					} else {
						offset += data.body.total;
					}
				} else {
					console.log("spotify.getMySavedTracks returned unsuccessful response code");
					endOfTracks = true;
				}
			}, function(error: any) {
				endOfTracks = true;
				res.send('error getting saved tracks!');
			})
		} catch (e: any) {
			console.log(e);
		}
	}
	listSongs()
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

export { login, getAuthorization, getUserSongsData };

