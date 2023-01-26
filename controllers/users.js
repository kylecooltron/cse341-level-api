const mongodb = require('../db/connect');
const database = "cse341-database";
const collection = "user_data";
const { validationResult } = require('express-validator');


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


const saveUserData = async (req, res) => {
    /**
     * Run by front-end to save user information in the database
     */
    try {

        if (!req.oidc.isAuthenticated()) {
            throw new Error(`Not authorized to check user status - please log in`);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const user_data = {
            user_id: req.oidc.user_id,
            user_name: req.oidc.user_name,
        }

        const alreadyExists = await mongodb.getDb().db(database).collection(collection).findOne(user_data);
        if (alreadyExists) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(alreadyExists);
        }

        // if user didn't already exists, add user info to database
        const response = await mongodb.getDb().db(database).collection(collection).insertOne(user_data);

        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            throw new Error(response.error || 'Some error occurred while adding new user to db.');
        }

    } catch (err) {
        res.status(500).send({
            error: String(err)
        });
    }
};



module.exports = { isAuthorized, saveUserData };