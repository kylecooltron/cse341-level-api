/**
 * returns various JSON responses from enemies collection
 */
const routes = require('express').Router();
const powerupController = require('../controllers/powerups');
const { powerupValidate } = require('../validate');

// get all Powerups
routes.get('/', powerupController.getAllPowerups);
// get Powerup by id
routes.get('/:id', powerupController.getPowerupById);
// post
routes.post('/', powerupValidate, powerupController.createPowerup);
// put
routes.put('/:id', powerupValidate, powerupController.updatePowerup);
// delete
routes.delete('/:id', powerupController.deletePowerup);


module.exports = routes;