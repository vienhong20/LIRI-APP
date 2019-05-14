require("dotenv").config();

//node module imports needed for functions
const axios = require("axios");
const request = require("request");
const Spotify = require("node-spotify-api");
const keys = require("./key.js");
const fs = require("fs");
// let used for terminal command if/elses
let liriArg = process.argv[2];

//terminal commands
if (liriArg === "spotify-this-song") {
  song();
} else if (liriArg === "movie-this") {
  movie();
} else if (liriArg === "do-what-it-says") {
  doSome();
} else {
  console.log(
    "Please enter one of the following commands: spotify-this-song, movie-this, do-what-it-says."
  );
}

//function to show movie data
function movie() {
  let args = process.argv;
  let movieName = "";

  for (i = 3; i < args.length; i++) {
    if (i > 3 && i < args.length) {
      movieName = movieName + "+" + args[i];
    } else {
      movieName = args[i];
    }
  }

  if (movieName === "") {
    movieName = "Mr." + "+" + "Nobody";
  }

  //run a request to the OMDB API with the specified movie
  let queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(
        "-------------------------------------------------------------------------------------------"
      );
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB rating: " + JSON.parse(body).imdbRating);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log(
        "-------------------------------------------------------------------------------------------"
      );
    } else {
      console.log("UH OH");
    }
  });
}

//function to show spotify data
function song() {
  let spotify = new Spotify(keys.spotify);
  let args = process.argv;
  let songName = "";

  for (i = 3; i < args.length; i++) {
    if (i > 3 && i < args.length) {
      songName = songName + " " + args[i];
    } else {
      songName = args[i];
    }
  }
  //console.log(songName);
  if (args.length < 4) {
    songName = "the sign ace of base";
    process.argv[3] = songName;
  }
  //console.log(songName);
  spotify.search(
    {
      type: "track",
      query: songName,
      limit: 1
    },
    function(err, data) {
      if (err) {
        console.log("UH OH: " + err);
        return;
      }
      console.log(
        "-------------------------------------------------------------------------------------------"
      );
      console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
      console.log("Song: " + data.tracks.items[0].name);
      console.log(
        "Preview link: " + data.tracks.items[0].external_urls.spotify
      );
      console.log("Album: " + data.tracks.items[0].album.name);
      console.log(
        "-------------------------------------------------------------------------------------------"
      );
    }
  );
}

//random fs function
function doSome() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var data = data.split(",");

    if (data[0] === "spotify-this-song") {
      process.argv[3] = data[1];
      song();
    }
  });
}
