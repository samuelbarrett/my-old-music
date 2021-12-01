import express from 'express';
import request from 'request';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


// Spotify developer credentials
const client_id = '06dd2159f6d24963829a1e9ede289664'
const client_secret = ''
const redirect_uri = 'http://localhost:8000/callback'

// set up express
const app = express()
const port = 8000
const origin = 'http://localhost:8000'
const stateKey = 'spotify-auth-state'
const scopes = 'user-read-private user-read-library'

app.use(express.static('../public'))	// allow serving of static content found in public directory (the HTML, any images.)
	.use(cookieParser())	// and use of cookieParser tool
	.use(cors( { origin: origin } ));

// return a randomly generated string of length characters
var getRandomString = function(length: Number) {
	var random = ''
	var choices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for(let i = 0; i < length; i++) {
		random += choices.charAt( Math.floor(Math.random() * choices.length) )
	}
	return random
}

// Spotify Web Api init
var SpotifyWebApi = require('spotify-web-api-node')

var spotify = new SpotifyWebApi({
	clientId: client_id,
	clientSecret: client_secret,
	redirectUri: redirect_uri
})


// -- EXPRESS ROUTING --

app.get('/', (req, res) => {
	res.sendFile('C:/Users/samue/Developer/my-old-music/public/home.html')
})

let state = getRandomString(16)

// redirect to Spotify Accounts Service
app.get('/login', function(req, res) {
	let scopes = 'user-library-read';
	
	res.cookie(stateKey, state);

	res.redirect('https://accounts.spotify.com/authorize?' + new URLSearchParams({
		response_type: 'code',
		client_id: encodeURIComponent(client_id),
		scope: encodeURIComponent(scopes),
		redirect_uri: redirect_uri,
		state: state
	}).toString());
	// ** Reference: the same URL parsed manually without URLSearchParams would look like this:
		// '?response_type=code' +
		// '&client_id=' + client_id +
		// (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
		// '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

// upon return from Spotify Accounts Service
app.get('/callback', (req, res) => {
	// --check state, check for presence of error or code parameter (fail or success)
	// --if fail, report
	// --if success, request access token using code
	var returnState = req.query.state || null
	var code = req.query.code || null
	var error = req.query.error || null

	if(returnState === state) {
		if(code !== null) {
			spotify.authorizationCodeGrant(code).then(
				function(data: any) {
				  	console.log('The token expires in ' + data.body['expires_in'])
				  	console.log('The access token is ' + data.body['access_token'])
				  	console.log('The refresh token is ' + data.body['refresh_token'])
			  
				  	// Set the access token on the API object to use it in later calls
				  	spotify.setAccessToken(data.body['access_token'])
				  	spotify.setRefreshToken(data.body['refresh_token'])
					
					// get tracks from library
					spotify.getMySavedTracks({
						limit: 3,
						offset: 70
					}).then(
						function(data: any) {
							console.log(data)
							// successful request
							if(data.statusCode == 200) {
								getSongList(data)
							} else {
								console.log("Error: request returned status code " + data.statusCode)
							}
						},
						function(err: any) {
							console.log(err)
						}
					)
				},
				function(err: any) {
				  console.log('Something went wrong!', err)
				}
			)
		} else {
			console.log(error)
		}
	} else {
		res.redirect('/#' + new URLSearchParams({
			error: 'state_mismatch'
		}))
	}

	res.sendFile('C:/Users/samue/Developer/my-old-music/public/home.html')
})

// -- PARSING THE DATA --

function getSongList(data: any) {
	// for each data.body.items, extract the song titles into a list
	// -pagination details in data.body
	// -statusCode in data
	if(data != null) {
		var songs: Array<Object> = data.body.items
		console.log("SONGS ARE: \n")
		songs.forEach(function(song) {
			console.log(song)	// this works!
		})
	}
}


app.listen(port, () => {
	console.log("We're live at localhost:8000");
})