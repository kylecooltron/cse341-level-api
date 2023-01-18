const routes = require('express').Router();

routes.use('/levels', require('./levels'))

module.exports = routes;
