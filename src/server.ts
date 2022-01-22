import express from 'express';
import request from 'request';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// file output for debugging
const fs = require('fs')
let songsFile = 'songs.txt'

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

// store the returned songs
let songlist: Array<Object> = [];

app.use(express.static('../public'))	// allow serving of static content found in public directory (the HTML, any images.)
	.use(cookieParser())	// and use of cookieParser tool
	.use(cors( { origin: origin } ))

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
	res.sendFile('/Users/samuel/Developer/my-old-music/public/home.html')
})

let state = getRandomString(16)

// redirect to Spotify Accounts Service
app.get('/login', function(req, res) {
	let scopes = 'user-library-read'
	
	res.cookie(stateKey, state)

	res.redirect('https://accounts.spotify.com/authorize?' + new URLSearchParams({
		response_type: 'code',
		client_id: encodeURIComponent(client_id),
		scope: encodeURIComponent(scopes),
		redirect_uri: redirect_uri,
		state: state
	}).toString())
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
					
					getUserSavedSongs()
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

	res.sendFile('/Users/samuel/Developer/my-old-music/public/home.html')
})

// -- PARSING THE DATA --

// fetch saved songs from spotify
function getUserSavedSongs() {
	// get tracks from library in multiple requests
	let numSongsPerRequest = 50		// maximum 50 per Spotify
	let offset = 0
	let end: boolean = false

	while(!end) {
		spotify.getMySavedTracks({
			limit: numSongsPerRequest,
			offset: offset
		}).then(
			function(data: any) {
				// successful request
				if(data.status == 200) {
					storeSongs(data)
					if(data.body.total < numSongsPerRequest) {	// have we reached the end?
						end = true
					}
				} else {
					console.log(data.message)
				}
			},
			function(err: any) {
				console.log(err)
			}
		)
		offset+=numSongsPerRequest
	}
	printArray(songlist)
}

// add each song to our local storage
function storeSongs(data: Array<Object>) {
	data.forEach((song) => {
		songlist.push(song)
	})
}

// print an array of objects to file
function printArray(data: Array<Object>) {
	data.forEach((element) => {
		fs.appendFile(songsFile, element + '\n', (err: any) => {
			console.log(err)
		})
	})
}

// // TO-DO: fix and finish averageAge calculation
// // iterate through songlist and obtain an average age of the song
// function averageAge(): any {
// 	// comparing dates here. Format is YYYY-MM-DD, is there a shortcut we could use? Or do it manually?
// 	// add each song's age to totalAge, then divide by numSongs
// 	// keep track of newest and oldest song
// 	var totalAge: number = 0	// number of days since song release
// 	var numSongs: number = songlist.length
// 	var oldest: any = null
// 	var newest: any = null
// 	let currentTime = Date.now()

// 	// -- PROBLEMS:
// 	// Not all songs have the same date format: see Soma - Remastered by Smashing Pumpkins only has year as 1993... hmm
// 	// we assume same format with different levels of detail. So if size of date.split == 1 we just take the year, if it's 2 we 
// 	// take YYYY-MM, if its 3 or more we take YYYY-MM-DD... three conditionals, Date can handle them all.
// 	// --

// 	while(songs.hasNext) {
// 		let current: any = songs.next
// 		var dateParams = (current.track.album.release_date).split("-")	// parse release date of the track
// 		let releaseDate = new Date(dateParams[0], dateParams[1]-1, dateParams[2])
// 		let epochElapsed = releaseDate.getTime()	// get epoch time (milliseconds since Jan 1 1970)
// 		totalAge += (currentTime - epochElapsed) / (1000 * 86400)	// add number of days since song release to totalAge
// 		console.log("current: " + current.track.name + "\nrelease_date: " + current.track.album.release_date + "\ntime: " + dateParams + "\ntotalAge: " + totalAge)
// 	}
// 	let averageAgeDays: number = totalAge / numSongs

// 	console.log("AVERAGE AGE: " + averageAgeDays)

// 	return { "oldest": oldest, "newest": newest, "average": averageAgeDays }
// }


app.listen(port, () => {
	console.log("We're live at localhost:8000");
})