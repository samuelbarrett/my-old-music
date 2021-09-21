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
var client_id = '06dd2159f6d24963829a1e9ede289664';
var client_secret = ''; // don't put this on github
var redirect_uri = 'http://localhost:8000/callback';

var app = express();	// Express object
var stateKey = 'spotify_auth_state';	// stateKey to be sent to Spotify (along with generated state string) for security.
										// Any legitimate response will have the same state string.

app.use(express.static('public'))	// allow serving of static content found in public directory (the HTML, any images.)
	.use(cookieParser());	// and use of cookieParser tool

// return a randomly generated string of length characters
var getRandomString = function(length) {
	let random = '';
	let choices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for(let i = 0; i < length; i++) {
		random += choices.charAt( Math.floor(Math.random() * choices.length) );
	}
	return random;
};

// ---- REQUESTS ----

// Homepage - home.html
app.get('/', function(req, res) {
	res.sendFile('home.html', {root: '../public'});
});

// Login redirects to Spotify's Accounts service for user authentication: uses Spotify's Authorization Code flow.
app.get('/login', function(req, res) {
	let state = getRandomString(16);
	let scopes = 'user-library-read';	// the permission(s) we require

	res.cookie(stateKey, state); // send the state to Spotify (it will return it, and we'll verify correctness)

	res.redirect('https://accounts.spotify.com/authorize' + new URLSearchParams({
		response_type: "code",
		client_id: client_id,
		scope: encodeURIComponent(scopes),
		redirect_uri: encodeURIComponent(redirect_uri)
	}).toString());
	// ** The same URL parsed manually without URLSearchParams would look like this:
		// '?response_type=code' +
		// '&client_id=' + client_id +
		// (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
		// '&redirect_uri=' + encodeURIComponent(redirect_uri));
});

// listen locally. This is for quick testing. When we host it on a server we'll need to change this, obviously.
console.log("Listening at localhost:8000");
app.listen(8000);