/**
 * returns various JSON responses from contacts collection
 */
const routes = require('express').Router();
const blocksController = require('../controllers/blocks');

// get all blocks
routes.get('/', blocksController.getAllBlocks);
// get block by id
routes.get('/:id', blocksController.getBlockById);
// post
routes.post('/', blocksController.createBlock);
// put
routes.put('/:id', blocksController.updateBlock);
// delete
routes.delete('/:id', blocksController.deleteBlock);


module.exports = routes;