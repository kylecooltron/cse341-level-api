/**
 * returns various JSON responses from contacts collection
 */
const routes = require('express').Router();
const contactsController = require('../controllers/contacts');

routes.get('/', contactsController.getAllContacts);
routes.get('/:id', contactsController.getContactById);

// post
routes.post('/', contactsController.createContact);
// put
routes.put('/:id', contactsController.updateContact);
// delete
routes.delete('/:id', contactsController.deleteContact);


module.exports = routes;