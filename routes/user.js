/**
 * returns various JSON responses from users collection
 */
const routes = require('express').Router();
const usersController = require('../controllers/users');

// get whether the user is signed in or not
routes.get('/authorized', usersController.isAuthorized);

// check if user is in database and add if not
routes.get('/save', usersController.saveUserData);

module.exports = routes;