/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
// Include Express Validator Functions

const isAuthorized = async (req, res) => {
    try {
        if (req.oidc.isAuthenticated()) {
            res.status(200).json({
                "authorized": true,
            });
        } else {
            res.status(200).json({
                "authorized": false,
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// get whether the user is signed in or not
routes.get('/', isAuthorized);


module.exports = routes;