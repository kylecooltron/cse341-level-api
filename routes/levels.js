/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const levelsController = require('../controllers/levels');

// get all Levels
routes.get('/', levelsController.getAllLevels);
// get Level by id
routes.get('/:id', levelsController.getLevelById);
// post
routes.post('/', levelsController.createLevel);
// put
routes.put('/:id', levelsController.updateLevel);
// delete
routes.delete('/:id', levelsController.deleteLevel);


module.exports = routes;