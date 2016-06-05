//allows access to the key.js file
var twitterKeys = require('./keys.js');

//placeholder value
var twitter = require('twitter');

//builds twitter object with keys to make calls
var tweets = new twitter(twitterKeys.twitterKeys);

//search parameter object
var twitterSearchParam = {
	screen_name: 'havamere',
	count: 20,
}

//general request variable
var request = require('request');

//allows access to the file system
var fs = require('fs');

//sets variable for arguments
var command = process.argv[2];

//sets variable to have acces to all other inputs as a parameter to the queries
var parameter = process.argv.slice(3).join('+');
//tests collection of parameter
//console.log(parameter);

//function for writing to txt.log
function writeToLog (textParam) {
	fs.appendFile('log.txt', textParam, function(err){
		if (err) {
			return console.log(err);
		};
		console.log('log.txt was updated');
	});
};

//logic to control what wappens based on user input
switch (command) {
	case 'my-tweets':
		getMyTweets();
	break;
	case 'spotify-this-song':
		getMusicInfo(parameter);
	break;
	case 'movie-this':
		getMovieInfo(parameter);
	break;
	case 'do-what-it-says':
		doSomethingRandom(parameter);
	break;
	default:
		console.log('That command was not recognized. Please try again.');

};

var writeableObj = "";

//function calls for cases --------------------------------------------------------------------------------------------------------

//twitter function
function getMyTweets(){
	tweets.get('statuses/user_timeline', twitterSearchParam, function(err, response, data){
		if (err) {
			console.log(err);
		};
		console.log('This is my last '+response.length+' tweets.')
		for (var i = 0; i < response.length; i++) {
			console.log('#'+(i+1)+": "+response[i].text);
			writeableObj += ', '+'#'+(i+1)+": "+response[i].text;
		};
	writeableObj = command +""+ writeableObj+"\n";
	writeToLog(writeableObj);
	});
};

//spotify function
function getMusicInfo(parameter){
	if (!parameter) {
		parameter = "what's+my+age+again";
	};
	var queryUrl = 'https://api.spotify.com/v1/search?query='+parameter+'&limit=1&type=track';
	request(queryUrl, function(err, response, body){
		if (err) {
			console.log(err);
		};
		body = JSON.parse(body);
		//console.log(body);
		console.log('--------------------------------------------------------------');
		console.log('The highest rated match for your search is:');
		console.log('Artist(s): '+body.tracks.items[0].artists[0].name);
		console.log('Song Title: '+body.tracks.items[0].name);
		console.log('Preview Link: '+body.tracks.items[0].preview_url);
		console.log('Album Name: '+body.tracks.items[0].album.name);
		console.log('--------------------------------------------------------------');
		//writes query request and response to log.txt
		writeableObj = command+", "+parameter+", "+body.tracks.items[0].artists[0].name+", "+body.tracks.items[0].name+", "+body.tracks.items[0].preview_url+", "+body.tracks.items[0].album.name+"\n";
		
		writeToLog(writeableObj);
	});
};

//OMDB function
function getMovieInfo(parameter){
	//covers scenario of no parameter typed
	if (!parameter) {
		parameter = 'mr.nobody';
	};
	//builds url for response with parameter from node request entry and include rotten tomatoes info
	var queryUrl = 'http://www.omdbapi.com/?t=' + parameter +'&y=&plot=short&r=json&tomatoes=true';
	//call request to omdb api
	request(queryUrl, function(err, response, body){
		//console logs error if one is present
		if (err) {
			console.log(err);
		} 
		//turns response into JSON object
		body = JSON.parse(body);
		//display's response in console.
		console.log('--------------------------------------------------------------');
		console.log('Title: '+ body.Title);
		console.log('Year released: '+ body.Year);
		console.log('IMDB rating: '+ body.imdbRating);
		console.log('Countries Released in: '+ body.Country);
		console.log('Languages Released in: '+ body.Language);
		console.log('Plot: '+ body.Plot);
		console.log('Actors: '+ body.Actors);
		console.log('Rotten Tomatoes Rating: '+ body.tomatoRating);
		console.log('Rotten Tomatoes URL: '+ body.tomatoURL);
		console.log('--------------------------------------------------------------');
		//writes query request and response to log.txt
		writeableObj = command+", "+parameter+", "+body.Title+", "+body.Year+", "+body.imdbRating+", "+body.Country+", "+body.Language+", "+body.Plot+", "+body.Actors+", "+body.tomatoRating+", "+body.tomatoURL+"\n";

		writeToLog(writeableObj);
	});
};

function doSomethingRandom(parameter){
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err){
			console.log(err);
		}
		var output = data.toString().split(',');
		//console.log(output);
		command = output[0];
		parameter = output[1];
		//console.log(command + parameter);
		switch (command) {
			case 'my-tweets':
				getMyTweets();
			break;
			case 'spotify-this-song':
				getMusicInfo(parameter);
			break;
			case 'movie-this':
				getMovieInfo(parameter);
			break;
			default:
				console.log('That command was not recognized. Please try again.');
		};
	});
};