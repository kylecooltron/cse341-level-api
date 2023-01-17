const routes = require('express').Router();


routes.use('/', require('./swagger'));
routes.use('/blocks', require('./blocks'))

module.exports = routes;
