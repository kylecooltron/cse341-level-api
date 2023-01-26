
const routes = require('express').Router();

routes.use('/levels', require('./levels'))
routes.use('/enemies', require('./enemies'))
routes.use('/powerups', require('./powerups'))

routes.use('/user', require('./user'))

module.exports = routes;
