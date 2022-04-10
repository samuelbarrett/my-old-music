let songs: any = [];

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

export { addSongs, listSongs, countSongs };