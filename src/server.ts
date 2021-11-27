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

// redirect to spotify user login
app.get('/login', function(req, res) {
	let state = getRandomString(16);
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




app.listen(port, () => {
	console.log("We're live at localhost:8000");
})