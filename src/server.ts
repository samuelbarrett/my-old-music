var SpotifyWebApi = require('spotify-web-api-node');

var spotify = new SpotifyWebApi({
	clientId: '06dd2159f6d24963829a1e9ede289664',
	clientSecret: '',
	redirectUri: 'http://localhost:5500/callback'
  });