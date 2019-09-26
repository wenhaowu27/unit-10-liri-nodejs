var fs = require("fs");
var axios = require("axios");
var Spotify = require('node-spotify-api');
require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var moment = require('moment'); //Both required to use moment for node
var userSelection=["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"]
console.log("node liri 0 for " + userSelection[0]);
console.log("node liri 1 for " + userSelection[1]);
console.log("node liri 2 for " + userSelection[2]);
console.log("node liri 3 for " + userSelection[3]);
var index = parseFloat(process.argv[2]); 
var options = userSelection[index];
var keySearch = process.argv[3];

console.log(options, keySearch);

 switch(options){
  case "concert-this":
    concertThis(keySearch);
      break;
  case "spotify-this-song":
    spotThisSong(keySearch);
      break;
  case "movie-this":
    movieThis(keySearch);
      break;
  case "do-what-it-says":
     doWhatItSays();
      break
};

//Bandsintown search function
function concertThis(concertSearch){
  userQuery=concertSearch;
  axios.get("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp")
  .then(function(response){
    // console.log(response.data);
    for (let i = 0; i < response.data.length; i++) {  
      console.log(JSON.stringify(response.data[i].venue.name, null, 2));
                      console.log(JSON.stringify(response.data[i].venue.country, null, 2));
                      console.log(JSON.stringify(response.data[i].venue.region, null, 2));
                      console.log(JSON.stringify(response.data[i].venue.city, null, 2));
                      console.log(JSON.stringify(moment().format(response.data[i].venue.datetime), null, 2));
      var text = "Name of the venue: " + JSON.stringify(response.data[i].venue.name, null, 2) + "\nVenue location:\n Country: " + JSON.stringify(response.data[i].venue.country, null, 2) + "\nRegion: " + JSON.stringify(response.data[i].venue.country, null, 2) + "\nCity: " + JSON.stringify(response.data[i].venue.city, null, 2) + "\nDate of the Event: " + JSON.stringify(moment().format(response.data[i].venue.datetime), null, 2) + "\n========================================================\n";
                      fs.appendFile("log.txt", text, function(err) {
  
                          // If an error was experienced we will log it.
                          if (err) {
                              console.log(err);
                          }
  
                          // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                          else {
                              console.log("Content Added to loge.txt!");
                          }
  
                      });
  }    
  })
  .catch(function(err) {
    console.log(err);
  });
} 
 
//Spotify search function
function spotThisSong(musicSearch){
  spotify
  .search({ type: 'track', query: musicSearch })
  .then(function(response) {
    // console.log(response);
    // console.log(data.body)
  })
  .catch(function(err) {
    console.log(err);
  });
  spotify.search(
    {
        type: "track",
        query: musicSearch
    },
    function (err, data) {
        if (err) {
            console.log("Error occurred: " + err);
            return;
        }
        var songs = data.tracks.items;

        for (var i = 0; i < songs.length; i++) {
            console.log("**********SONG INFO*********");
            fs.appendFileSync("log.txt", "**********SONG INFO*********\n");
            console.log(i);
            fs.appendFileSync("log.txt", i +"\n");
            console.log("Song name: " + songs[i].name);
            fs.appendFileSync("log.txt", "song name: " + songs[i].name +"\n");
            console.log("Preview song: " + songs[i].preview_url);
            fs.appendFileSync("log.txt", "preview song: " + songs[i].preview_url +"\n");
            console.log("Album: " + songs[i].album.name);
            fs.appendFileSync("log.txt", "album: " + songs[i].album.name + "\n");
            console.log("Artist(s): " + songs[i].artists[0].name);
            fs.appendFileSync("log.txt", "artist(s): " + songs[i].artists[0].name + "\n");
            console.log("*****************************");  
            fs.appendFileSync("log.txt", "*****************************\n");
         }
    }
);
}

//Movie search function
function movieThis(movieSearch){
  movieName = movieSearch;
  axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy")
  .then(function(response){
    console.log(response);
    console.log("Title of the movie: " + response.data.Title);
    console.log("Year the movie came out: " + response.data.Year);
    console.log("IMDB Rating of the movie: " + response.data.Rated);
    console.log("Rotten Tomatoes Rating of the movie: " + response.data.Ratings[2].Value);
    console.log("Country where the movie was produced: " + response.data.Country);
    console.log("Language of the movie: " + response.data.Language);
    console.log("Plot of the movie: " + response.data.Plot);
    console.log("Actors in the movie: " + response.data.Actors);
    var fs = require("fs");
    var text = "Title of the movie: " + response.data.Title + "\n" + "Year the movie came out: " + response.data.Year + "\n" + "IMDB Rating of the movie: " + response.data.Rated + "\n" + "Rotten Tomatoes Rating of the movie: " + response.data.Ratings[2].Value + "\n" + "Country where the movie was produced: " + response.data.Country + "\n" + "Language of the movie: " + response.data.Language + "\n" + "Plot of the movie: " + response.data.Plot + "\n" + "Actors in the movie: " + response.data.Actors + "\n========================================================\n";
    fs.appendFile("log.txt", text, function(err) {

        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }

        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            console.log("Content Added to loge.txt!");
        }

    });
})            .catch(function(error) {
  if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
  } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
  } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
  }
  console.log(error.config);
});
}

  //Do what it says function
function doWhatItSays(){
  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
  
    // We will then print the contents of data
    console.log(data);
  
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
  
    // We will then re-display the content as an array for later use.
    console.log(dataArr);
    spotThisSong(dataArr[1]);  
  });


};

//End curl bracket

