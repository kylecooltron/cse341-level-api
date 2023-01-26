const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const database = "cse341-database";
const collection = "enemy_data";
const { validationResult } = require('express-validator');


const getAllEnemies = async (req, res) => {
  try {
    await mongodb.getDb().db(database).collection(collection).find().toArray((err, list) => {
      if (err) {
        res.status(500).send({
          error: `Cannot convert to array: ${err}`,
        });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(list);
    });

  } catch (err) {
    res.status(500).json(err);
  }
};

const getEnemyById = async (req, res) => {
  try {

    await mongodb.getDb().db(database).collection(collection).find(
      {
        "_id": ObjectId(req.params.id)
      }
    ).toArray((err, list) => {

      if (err) {
        res.status(500).send({
          error: `Cannot convert to array: ${err}`,
        });
      }

      if (list.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(list[0]);
      } else {
        res.status(500).send({
          error: `Enemy not found with id ${req.params.id}`,
        });
      }

    })

  } catch (err) {
    res.status(500).send({
      error: String(err),
      params: req.params
    });
  }
};


const createEnemy = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const alreadyExists = await mongodb.getDb().db(database).collection(collection).findOne({ level_name: req.body.level_name });
    if (alreadyExists) {
      throw new Error(`Enemy with name already exists: ${req.body.level_name}`);
    }

    const response = await mongodb.getDb().db(database).collection(collection).insertOne(req.body);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw new Error(response.error || 'Some error occurred while creating the enemy.');
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      body: req.body
    });
  }

};


const deleteEnemy = async (req, res) => {
  try {

    if (!req.oidc.isAuthenticated()) {
      throw new Error(`Not authorized to delete, please log in at /login `);
    }

    const levelId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db(database).collection(collection).deleteOne({ _id: levelId }, true);

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      const err_string = `ID: ${req.params.id} may not exist in the DB`;
      throw new Error(response.error || err_string);
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      params: req.params
    });
  }
};

const updateEnemy = async (req, res) => {
  try {

    if (!req.oidc.isAuthenticated()) {
      throw new Error(`Not authorized to update level, please log in at /login `);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const levelId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db(database).collection(collection).replaceOne({ _id: levelId }, req.body);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      const err_string = `ID: ${req.params.id} may not exist in the DB`;
      throw new Error(response.error || err_string);
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      params: req.params,
      body: req.body
    });
  }
};


module.exports = { getAllEnemies, getEnemyById, createEnemy, deleteEnemy, updateEnemy };