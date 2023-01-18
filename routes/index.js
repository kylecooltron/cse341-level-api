const routes = require('express').Router();


routes.use('/', require('./swagger'));
routes.use('/levels', require('./levels'))

module.exports = routes;
