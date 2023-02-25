import SpotifyWebApi from 'spotify-web-api-node';
import { URLSearchParams } from 'url';
import auth from '../auth.json' assert { type: 'json'};
import web from '../web.json' assert { type: 'json'};

const scopes = 'user-library-read';
const stateKey = 'spotify-auth-state';
let stateCookie: string;

let songs: any = [];
let userdata = {
	avgMusicAgeDays: -1,
	avgMusicAgeYears: -1
}

// spotifyWebApi client object
const spotify = new SpotifyWebApi({
	clientId: auth.CLIENT_ID,
	clientSecret: auth.SECRET,
	redirectUri: web.REDIRECT_SIGNEDIN
});

// request user authentication from Spotify Accounts Service
function login(req: any, res: any) {
	stateCookie = getRandomString(16);

	res.cookie(stateKey, stateCookie);

	res.redirect('https://accounts.spotify.com/authorize?' + new URLSearchParams([
		["response_type", "code"],
		["client_id", encodeURIComponent(auth.CLIENT_ID)],
		["scope", encodeURIComponent(scopes)],
		["redirect_uri", web.REDIRECT_SIGNEDIN],
		["state", stateCookie]
	]).toString());
};

function getAuthorization(req: any, res: any) {
	let returnState = req.query.state || null;
	let code = req.query.code || null;
	let error = req.query.error || null;

	if (returnState === stateCookie) {
		if (code !== null) {
			spotify.authorizationCodeGrant(code).then(
				function(data: any) {
				  	console.log('The token expires in ' + data.body['expires_in']);
				  	console.log('The access token is ' + data.body['access_token']);
				  	console.log('The refresh token is ' + data.body['refresh_token']);
			  
				  	spotify.setAccessToken(data.body['access_token']);
				  	spotify.setRefreshToken(data.body['refresh_token']);
					
					res.redirect(`${web.ORIGIN}${web.PORT}/${web.SPOTIFY_AUTH_SUCCESS_ENDPOINT}`);
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
async function requestSongsInLibrary() {
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
				return endOfTracks;
			}
		} catch (e: any) {
			console.log(e);
			endOfTracks = true;
		}
	}
	return endOfTracks;
};

async function getData(req: any, res: any) {
	if (songs.length == 0) {
		await requestSongsInLibrary();
		calculateStatistics();
	}
};

// generate a random string of defined length
function getRandomString(length: Number): string {
	let randomString = '';
	let validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		randomString += validChars.charAt( Math.floor(Math.random() * validChars.length) );
	}
	return randomString;
}


function addSongs(input: any) {
	input.forEach((elem: any) => {
		songs.push(elem);
	})
}

function countSongs(): number {
	return songs.length;
}

function calculateStatistics() {
	calcAvgAgeDays();
	calcAvgAgeYears();
}

// calculate the mean age of the songs in days since released
function calcAvgAgeDays() {
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
		};

		releaseDate = new Date(dateString);
		totalAge += (currentDate.getTime() - releaseDate.getTime()) / 1000 / 86400;
		numSongs++;
	});

	console.log('ITERATED THROUGH ' + numSongs);

	userdata.avgMusicAgeDays = Math.round(totalAge / songs.length);
}

function calcAvgAgeYears() {
	// divide days into years and chop off everything after the first two decimal places. toFixed
	userdata.avgMusicAgeYears = Number((userdata.avgMusicAgeDays / 365.25).toFixed(2));
}

function getMusicAgeYears(): string {
	return userdata.avgMusicAgeYears.toString();
}

function getMusicAgeDays(): string {
	return userdata.avgMusicAgeDays.toString();
}

export { login, getAuthorization, getData, getMusicAgeYears, getMusicAgeDays };