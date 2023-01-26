/**
 * returns various JSON responses from enemies collection
 */
const routes = require('express').Router();
const enemyController = require('../controllers/enemies');
const { enemyValidate } = require('../validate');

// get all Enemies
routes.get('/', enemyController.getAllEnemies);
// get Enemy by id
routes.get('/:id', enemyController.getEnemyById);
// post
routes.post('/', enemyValidate, enemyController.createEnemy);
// put
routes.put('/:id', enemyValidate, enemyController.updateEnemy);
// delete
routes.delete('/:id', enemyController.deleteEnemy);


module.exports = routes;