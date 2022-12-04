import e from "express";

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

export { addSongs, listSongs, countSongs, averageAgeInDays };