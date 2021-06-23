var TvShow = require('../models/tvshows');
var Genre = require('../models/genre');
const { body,validationResult } = require('express-validator');
const fetch = require('node-fetch');

var async = require('async');
const { func } = require('@hapi/joi');

exports.index = function(req, res) {

    async.parallel({
        tvshow_count: function(callback) {
            TvShow.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Tv Shows Library', error: err, data: results });
    });
};

exports.tvshows =  function(req, res ){
    
        fetch(`http://api.tvmaze.com/search/shows?q=riverdale`)
        .then(res => res.json())
        .then(jsonData => {
         const showlist =  jsonData.map(element => element.show);
         
         res.render('movie', {showlist});
        })
        .catch(err => res.send(err))
    
    }
exports.tvshows_search = function(req,res){
    
    fetch(`http://api.tvmaze.com/search/shows?q=${req.body.tvshow}`)
    .then(res => res.json())
    .then(jsonData => {
     const showlist =  jsonData.map(element => element.show);
     
     res.render('movie', {showlist});
    })
    .catch(err => res.send(err))
}
// Display list of all tv shows.
exports.tvshow_list = function(req, res, next) {

    TvShow.find({}, 'title genre director summary poster')
      .populate('genre')
      .exec(function (err, list_tvshows) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('tvshow_list', { title: 'TvShows List', tvshow_list: list_tvshows });
      });
  
  };

// Display detail page for a specific show.
exports.tvshow_detail = function(req, res, next) {

    async.parallel({
        tvshow: function(callback) {

            TvShow.findById(req.params.id)
              .populate('genre')
              .exec(callback);
        },
      
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.tvshow==null) { // No results.
            var err = new Error('show not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('tvshow_detail', { title: results.tvshow.title, tvshow: results.tvshow } );
    });

};


// Display tvshow create form on GET.
exports.tvshow_create_get = function(req, res, next) {

    // Get  genres, which we can use for adding to our tvshow.
    async.parallel({
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('tvshow_form', { title: 'Create Tvshow',  genres: results.genres });
    });

};

// Handle tvshow create on POST.
exports.tvshow_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ==='undefined')
            req.body.genre = [];
            else
            req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitise fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('director', 'Director must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a TvShhow object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            director: req.body.director,
            summary: req.body.summary,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all genres for form.
            async.parallel({
            
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (tvshow.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('tvshow_form', { title: 'Create Tvshow',genres:results.genres, tvshow: tvshow, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save tvshow.
            tvshow.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new tvshow record.
                   res.redirect(tvshow.url);
                });
        }
    }
];

