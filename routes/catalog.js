var express = require('express');
var router = express.Router();

// Require controller modules.
var tvshowController = require('../controllers/tvshowController');
var genre_controller = require('../controllers/genreController');
var user_controller = require('../controllers/userController');
const {ensureAuthenticated} = require("../config/auth.js");


/// TVSHOW ROUTES ///

// GET catalog home page.
router.get('/', tvshowController.index);
// GET request for creating a tvshow
router.get('/tvshow/create', tvshowController.tvshow_create_get);

// POST request for creating tvshow.
router.post('/tvshow/create', tvshowController.tvshow_create_post);

// GET request for one Show.
router.get('/tvshow/:id', tvshowController.tvshow_detail);

// GET request for list of all Tv Showws.
router.get('/tvshows', tvshowController.tvshow_list);


/// GENRE ROUTES ///


// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

// POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);
// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

//SIGN UP ROUTE
router.get('/user/signup', user_controller.user_create_get);

router.post('/user/signup',  user_controller.user_create_post);

//LOGIN ROUTE

router.get('/user/login', user_controller.user_login_get);
router.post('/user/login', user_controller.user_login);

router.get('/user/login/profile', ensureAuthenticated, user_controller.user_profile);
router.get('/user/logout', user_controller.logout);


module.exports = router;