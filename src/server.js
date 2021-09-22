//	server.js
//
// 	Sam Barrett
// 	2021/09/14
// 	
//	Handle requests for My Old Music using Express web framework.

//	Express and related tools
var express = require('express');
var request = require('request');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Spotify developer credentials
// TODO: we'll need a server-side way to handle this delicate information securely. That comes later.
const client_id = '06dd2159f6d24963829a1e9ede289664';
const client_secret = ''; // don't put this on github
const redirect_uri = 'http://localhost:8000/callback';

var app = express();	// Express object
var stateKey = 'spotify_auth_state';	// stateKey to be sent to Spotify (along with generated state string) for security.
										// Any legitimate response will have the same state string.

app.use(express.static('../public'))	// allow serving of static content found in public directory (the HTML, any images.)
	.use(cookieParser())	// and use of cookieParser tool
	.use(cors());

// return a randomly generated string of length characters
var getRandomString = function(length) {
	var random = '';
	var choices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for(let i = 0; i < length; i++) {
		random += choices.charAt( Math.floor(Math.random() * choices.length) );
	}
	return random;
};

// ---- Express Routing ----

// Homepage - home.html
app.get('/', function(req, res) {
	res.sendFile('home.html', {root: '../public'});
});

// Login redirects to Spotify's Accounts service for user authentication: uses Spotify's Authorization Code flow.
app.get('/login', function(req, res) {
	let state = getRandomString(16);
	let scopes = 'user-library-read';	// the permission(s) we require

	res.cookie(stateKey, state); // send the state to Spotify (it will return it, and we'll verify correctness)

	res.redirect('https://accounts.spotify.com/authorize?' + new URLSearchParams({
		response_type: 'code',
		client_id: encodeURIComponent(client_id),
		scope: encodeURIComponent(scopes),
		redirect_uri: redirect_uri,
		state: state
	}).toString());
	// ** The same URL parsed manually without URLSearchParams would look like this:
		// '?response_type=code' +
		// '&client_id=' + client_id +
		// (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
		// '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

// Callback from the Spotify Accounts service.
//	Upon return, ...
app.get('/callback', function(req, res) {
	
	// data returned by spotify
	console.log(req.query);
	let code = req.query.code || null;
	let state = req.query.state || null;
	let storedState = req.cookies ? req.cookies[stateKey] : null;

	// check validity of state
	if( state === null || state !== storedState ) {
		res.redirect('/#' + new URLSearchParams({error: "state_mismatch"}).toString()); // re-route to error page (TODO)
		console.log("error on callback route: state mismatch");
		console.log("\t* code = " + code + "\n\t* state = " + state + "\n\t* storedState = " + storedState);
	}
	else {
		res.clearCookie(stateKey);
		// params for our request to receive access/refresh token
		let authParams = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: redirect_uri,
				grant_type: 'authorization_code'
			},
			headers: {
				'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
			},
			json: true
		};

		// request access and refresh tokens
		request.post(authParams, function(err, response, body) {
			// no error on request, code 200: success
			if(!err && response.statusCode === 200) {

				var access_token = body.access_token,
					refresh_token = body.refresh_token;
				
				// here's where we'll configure options for our data request (user library information)
				var options = {
					url: 'https://api.spotify.com/v1/me/tracks',
					form: {
						limit: 50,
						offset: 0
					},
					headers: {
						'Authorization': 'Bearer' + access_token
					},
					json: true
				}
				// make our user-library request
				request.get(options, function(err, response, body) {
					console.log(body);
				});
			}
			// code other than 200
			else {
				res.redirect('/#' + 
					new URLSearchParams({
						error: 'invalid_token: status code ' + response.statusCode
					})
				);
			}
		});
	}
});

// listen locally. This is for quick testing. When we host it on a server we'll need to change this, obviously.
console.log("Listening at localhost:8000");
app.listen(8000);