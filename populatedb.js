#! /usr/bin/env node

console.log('This script populates some tvshows and genres');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var TvShow = require('./models/tvshows')
var Genre = require('./models/genre')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var genres = []
var tvshows = []



function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function tvshowCreate(title, director, summary,poster, id ,genre, cb) {
  tvshowdetail = { 
    poster: poster,
    title: title,
    summary: summary,
    director: director,
    id: id
  }
  if (genre != false) tvshowdetail.genre = genre
    
  var tvshow = new TvShow(tvshowdetail);    
  tvshow.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New TvShow: ' + tvshow);
    tvshows.push(tvshow)
    cb(null, tvshow)
  }  );
}





function createGenre(cb) {
    async.parallel([
      
        function(callback) {
          genreCreate("Comedy", callback);
        },
        function(callback) {
          genreCreate("Drama", callback);
        },
        function(callback) {
            genreCreate("Fantasy", callback);
          },
        function(callback) {
          genreCreate("Crime", callback);
        },
        ],
        // optional callback
        cb);
}


function createTvShows(cb) {
    async.parallel([
        function(callback) {
          tvshowCreate('Modern Family', 'Fred Savage', 'Modern Family is an American mockumentary family sitcom television series created by Christopher Lloyd and Steven Levitan for the American Broadcasting Company. It ran for eleven seasons, from September 23, 2009, to April 8, 2020.','https://en.wikipedia.org/wiki/Modern_Family_(season_5)#/media/File:Modern_Family_Season_5.jpg','01' , [genres[0],], callback);
        },
        function(callback) {
            tvshowCreate("Friends", 'Gary Halvorson	, Kevin Bright ,James Burrows','Follow the lives of six reckless adults living in Manhattan, as they indulge in adventures which make their lives both troublesome and happening.','https://en.wikipedia.org/wiki/Friends#/media/File:Friends_season_one_cast.jpg','02', [genres[0],], callback);
        },
       
        function(callback) {
            tvshowCreate('Game of Thrones', 'D. B. Weiss', 'Game of Thrones is an American fantasy drama television series created by David Benioff and D. B. Weiss for HBO. It is an adaptation of A Song of Ice and Fire, a series of fantasy novels by George R. R. Martin, the first of which is A Game of Thrones.','https://en.wikipedia.org/wiki/Game_of_Thrones_(season_2)#/media/File:Game_of_Thrones_Season_2.jpg', '03', [genres[1],genres[2]], callback);
        },
        function(callback) {
            tvshowCreate('The Serpent', 'Tom Shankland, Hans Herbots‎', 'The Serpent is a British crime drama serial developed by Mammoth Screen and commissioned by the BBC. The eight-part limited series is a co-production between BBC One and Netflix. It is based on the crimes of serial killer Charles Sobhraj, who murdered young tourists between 1975–2000.','https://en.wikipedia.org/wiki/The_Serpent_(TV_series)#/media/File:The_Serpent_(TV_series).jpg', '04',[genres[3],] , callback)
        }
        ],
        // optional callback
        cb);
}




async.series([
    createGenre,
    createTvShows,
    
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }

    // All done, disconnect from database
    mongoose.connection.close();
});
