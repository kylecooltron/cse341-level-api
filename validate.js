const { check } = require('express-validator');

const levelValidate = [
    check('level_name', 'Minimum 3 characters.').exists().isLength({ min: 3 }).trim().escape(),
    check('level_author', 'Minimum 3 characters.').exists().isLength({ min: 3 }).trim().escape(),
    check('level_block_data').exists().isArray({ min: 1 }),
    check('level_block_data.*.grid_x').trim().isNumeric(),
    check('level_block_data.*.grid_y').trim().isNumeric(),
    check('level_block_data.*.width').trim().isNumeric(),
    check('level_block_data.*.height').trim().isNumeric(),
    check('level_block_data.*.color').isLength({ min: 3 }).trim().escape().isIn([
        'blue', 'red', 'purple', 'gray', 'black', 'lime', 'green', 'red', 'yellow'
    ]),
    check('level_block_data.*.bouncy').isBoolean(),
    check('level_block_data.*.causes_damage').isBoolean(),
]

const userValidate = [
    check('user_name', 'Minimum 3 characters.').exists().isLength({ min: 3 }).trim().escape(),
    check('user_id', 'Minimum 3 characters.').exists().isLength({ min: 3 }).trim().escape(),
]

const enemyValidate = [
    check('name', 'Minimum 3 characters.').exists().isLength({ min: 3 }).trim().escape(),
    check('hit_points').trim().isNumeric(),
    check('image_url').trim().isLength({ min: 3 }).escape(),
]

const powerupValidate = [
    check('name', 'Minimum 3 characters.').exists().isLength({ min: 3 }).trim().escape(),
    check('health_boost').trim().isNumeric(),
    check('speed_boost').trim().isNumeric(),
    check('defense_boost').trim().isNumeric(),
    check('image_url').trim().isLength({ min: 3 }).escape(),
]

module.exports = { levelValidate, userValidate, enemyValidate, powerupValidate };