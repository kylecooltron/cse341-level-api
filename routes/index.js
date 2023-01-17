const routes = require('express').Router();


routes.use('/', require('./swagger'));
routes.use('/contacts', require('./contacts'))
routes.use('/contacts-generate', require('./contacts-generate'))

module.exports = routes;
