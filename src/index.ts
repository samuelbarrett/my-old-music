import SpotifyWebApi from 'spotify-web-api-node';
import { URLSearchParams } from 'url';
import auth from '../auth.json' assert { type: 'json'};
import web from '../web.json' assert { type: 'json'};

const scopes = 'user-library-read';
const stateKey = 'spotify-auth-state';
let state: string;

let songs: any = [];

const spotify = new SpotifyWebApi({
	clientId: auth.CLIENT_ID,
	clientSecret: auth.SECRET,
	redirectUri: web.REDIRECT_SIGNEDIN
});

// request user authentication from Spotify Accounts Service
function login(req: any, res: any) {
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
			let data = await spotify.getMySavedTracks({
				limit: numSongsPerRequest,
				offset: offset
			});

			if (data.statusCode === 200) {
				addSongs(data.body.items);
				console.log(`SONG COUNT = ${countSongs()}`)

				if (data.body.next == null) {
					endOfTracks = true;
				} else {
					offset += numSongsPerRequest;
				}
			} else {
				console.log("spotify.getMySavedTracks returned unsuccessful response code");
				endOfTracks = true;
			}
		} catch (e: any) {
			console.log(e);
		}
	}
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


let addSongs = function(input: any) {
	input.forEach((elem: any) => {
		songs.push(elem);
	})
}

let listSongs = function() {
	songs.forEach((song: any) => {
		console.log(song.track.name);
	});
}

let countSongs = function(): Number {
	return songs.length;
}

let averageAgeInDays = function(): number {
	let result = 0;
	let totalAge = 0;
	let numSongs = 0;

	songs.forEach((song: any) => {
		let currentDate = new Date();
		let releaseDate: Date = new Date();
		let precision = song.track.album.release_date_precision;
		let dateString: string;

		switch (precision) {
			case 'day':
				dateString = song.track.album.release_date;
				break;
			case 'month':
				dateString = `${song.track.album.release_date}-${currentDate.getDate()}`;
				break;
			case 'year':
				dateString = `${song.track.album.release_date}-${currentDate.getMonth()+1}-${currentDate.getDate()}`;
				break;
			default:
				throw new Error(`${song.track.name}: precision not day, month or year: ${song.track.album.release_date} with precision ${song.track.album.release_date_precision}`)
		}

		releaseDate = new Date(dateString);
		totalAge += (currentDate.getTime() - releaseDate.getTime()) / 1000 / 86400;
		numSongs++;
	});

	console.log("ITERATED THROUGH " + numSongs);

	return totalAge / songs.length;
}

export { login };