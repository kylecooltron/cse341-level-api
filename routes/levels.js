/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const levelsController = require('../controllers/levels');
const { levelValidate } = require('../validate');
// Include Express Validator Functions


// get all Levels
routes.get('/', levelsController.getAllLevels);
// get Level by id
routes.get('/:id', levelsController.getLevelById);
// post
routes.post('/', levelValidate, levelsController.createLevel);
// put
routes.put('/:id', levelValidate, levelsController.updateLevel);
// delete
routes.delete('/:id', levelsController.deleteLevel);


module.exports = routes;