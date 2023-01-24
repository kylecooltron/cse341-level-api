const routes = require('express').Router();



routes.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});


routes.use('/levels', require('./levels'))

module.exports = routes;
