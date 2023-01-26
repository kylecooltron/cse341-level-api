
const routes = require('express').Router();

routes.use('/levels', require('./levels'))

routes.use('/user', require('./user'))

module.exports = routes;
