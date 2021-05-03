var Genre = require('../models/genre');
var TvShow = require('../models/tvshows');
var async = require('async');
const { body,validationResult } = require("express-validator");
// Display list of all Genre.
exports.genre_list = function(req, res, next) {

    Genre.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_genres) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('genre_list', { title: 'Genre List', list_genres:  list_genres});
      });
  
  };

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_tvshows: function(callback) {
            TvShow.find({ 'genre': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_tvshows: results.genre_tvshows } );
    });

};
// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {
  res.render('genre_form', { title: 'Create Genre'});
};

// Handle Genre create on POST.
exports.genre_create_post = [

  // Validate and santise the name field.
  body('name', 'Genre name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a genre object with escaped and trimmed data.
      var genre = new Genre(
        { name: req.body.name }
      );


      if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
      return;
      }
      else {
          // Data from form is valid.
          // Check if Genre with same name already exists.
          Genre.findOne({ 'name': req.body.name })
              .exec( function(err, found_genre) {
                   if (err) { return next(err); }

                   if (found_genre) {
                       // Genre exists, redirect to its detail page.
                       res.redirect(found_genre.url);
                   }
                   else {

                       genre.save(function (err) {
                         if (err) { return next(err); }
                         // Genre saved. Redirect to genre detail page.
                         res.redirect(genre.url);
                       });

                   }

               });
      }
  }
];