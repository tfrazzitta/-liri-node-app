
var twitterObj ={};
var spotifyObj={};
var object={};
var Twitter = require('twitter');
var twit = require("./keys.js");
var spotify= require("spotify");
var request = require('request');
var inquirer = require("inquirer");
var fs= require("fs");

 var client = new Twitter({
    consumer_key: twit.twitterKeys.consumer_key,
    consumer_secret: twit.twitterKeys.consumer_secret,
    access_token_key:  twit.twitterKeys.access_token_key,
    access_token_secret: twit.twitterKeys.access_token_secret
 });

//console.log(client);
var input = process.argv[2];



if(input==="my-tweets"){twitter();}
if(input==="spotify-this-song"){Spotify();}
if (input==="movie-this"){movie();}
if(input==="do-what-it-says"){doWhatItSays();}


function twitter(){
  var params = {screen_name: '@tfrazzitta',count:20};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
          for(i=0; i< tweets.length;i++){
                twitterObj.tweet= tweets[i].text;
                twitterObj.date = tweets[i].created_at;
                console.log(JSON.stringify(twitterObj,null,2));
            } //end of for loop
      } //end of error
  }); //end of twitter retrieval 
} //end of twitter fubnction


function Spotify(){
  inquirer.prompt([
  {
    type: "input",
    message: "Enter Name of song: ",
    name: "name"
  } 

                ]).then(function(user){
  	               if(user.name=== "undef"){
  	                   	user.name= "Ace of Base";
  	                      spotify.search({ type: 'track', query: user.name }, function(err, data) {

                    if(!err){
                      console.log(data.tracks.items[0].name);
     	                console.log(data.tracks.items[0].album.artists[0].name);
     	                console.log(data.tracks.items[0].album.artists[0].href);
     	                console.log(data.tracks.items[0].album.name);
                               fs.appendFile("log.txt", JSON.stringify({
                                  name:data.tracks.items[0].name,
                                  artist: data.tracks.items[0].album.artists[0].name,
                                  href:  data.tracks.items[0].album.artists[0].href,
                                  album:data.tracks.items[0].album.name
                                }))
                             }


                     else{
                      console.log(err);
                          }
          }); // end of spotify search
       }; //end of if statement
   }); // end of user function
}     //end of spotify function


function movie(){

  inquirer.prompt([
  {
    type: "input",
    message: "Enter Name of movie: ",
    name: "name"
  } 
                ]).then(function(user){
 
                   request("http://www.omdbapi.com/?t="+user.name+"&y=&plot=short&r=json", function(error,response,body) {

                    	if(error){
                       	  request("http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&r=json", function(error,response,body) {
                            console.log(JSON.parse(body).Title);
                            console.log(JSON.parse(body).Year);
                            console.log(JSON.parse(body).Rated);
                            console.log(JSON.parse(body).Country);
                            console.log(JSON.parse(body).Language);
                            console.log(JSON.parse(body).Plot);
                            console.log(JSON.parse(body).Actors);
                            console.log(JSON.parse(body).Ratings[1])
                                     fs.appendFile("log.txt", JSON.stringify({
                                        Title:JSON.parse(body).Title,
                                        Year: JSON.parse(body).Year,
                                        Rated:JSON.parse(body).Rated,
                                        Country:JSON.parse(body).Country,
                                        Language:JSON.parse(body).Language,
                                        Plot:JSON.parse(body).Plot,
                                        Actors:JSON.parse(body).Actors,
                                        Ratings:JSON.parse(body).Ratings[1]
                                       }))

                                });//end of error request
                               		 	return;
                                   		}

                                   else{

                                          console.log(JSON.parse(body).Title);
                                          console.log(JSON.parse(body).Year);
                                          console.log(JSON.parse(body).Rated);
                                          console.log(JSON.parse(body).Country);
                                          console.log(JSON.parse(body).Language);
                                          console.log(JSON.parse(body).Plot);
                                          console.log(JSON.parse(body).Actors);
                                          console.log(JSON.parse(body).Ratings[1])
                                          console.log("https://www.rottentomatoes.com/m/"+user.name.split(' ').join('_'))


                                          fs.appendFile("log.txt", JSON.stringify({
                                              Title:JSON.parse(body).Title,
                                              Year: JSON.parse(body).Year,
                                              Rated:JSON.parse(body).Rated,
                                              Country:JSON.parse(body).Country,
                                              Language:JSON.parse(body).Language,
                                              Plot:JSON.parse(body).Plot,
                                              Actors:JSON.parse(body).Actors,
                                              Ratings:JSON.parse(body).Ratings[1]
                                          }))
        }
     }); //end of movie search
  }); //end of function(user)
} //end of movie function


function doWhatItSays(){
  fs.readFile("random.text","utf8", function(error,data){
  var index= data.indexOf(",");
  var entry= data.substr(0,index);
  var song= data.substr(index+1)
   
    spotify.search({ type: 'track', query: song }, function(err, data) {
         	 console.log(data.tracks.items[0].name);
         	 console.log(data.tracks.items[0].album.artists[0].name);
         	 console.log(data.tracks.items[0].album.artists[0].href);
         	 console.log(data.tracks.items[0].album.name);
     })//end of function(user)
	})//end of movie search
}//end of do what it says function


