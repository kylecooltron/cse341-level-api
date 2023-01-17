/**
 * returns simple HTML page
 */
const routes = require('express').Router();
const homeController = require('../controllers/home');

routes.get('/', homeController.index);
module.exports = routes;