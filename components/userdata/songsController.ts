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

let averageAgeInDays = function(): number {
	let result = 0;
	let totalAge = 0;
	let numSongs = 0;

	songs.forEach((song: any) => {
		let releaseDate: Date = new Date();
		let precision = song.track.album.release_date_precision;

		if (precision == 'day') {
			releaseDate = new Date(song.track.album.release_date);
		} else if (precision == 'year') {
			// songs with only release year will be assumed to have released on current day of that year
			let currentDate = new Date();
			let dateString = `${song.track.album.release_date}-${currentDate.getMonth()+1}-${currentDate.getDate()}`;
			console.log(dateString);
			releaseDate = new Date(dateString);
		} else {
			console.log(song.track.name + " : release date precision is not day or year!");
		}

		numSongs++;
		totalAge += (releaseDate.getTime()) / 1000 / 86400;
	});

	console.log("ITERATED THROUGH " + numSongs);

	return totalAge / songs.length;
}

export { addSongs, listSongs, countSongs, averageAgeInDays };