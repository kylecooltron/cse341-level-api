/**
 * returns various JSON responses from contacts collection
 */
const routes = require('express').Router();
const contactsController = require('../controllers/contacts');

// post
routes.post('/', contactsController.createRandomizedContact);

module.exports = routes;