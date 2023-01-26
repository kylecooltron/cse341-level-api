const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const database = "cse341-database";
const collection = "level_data";
const { validate_request, ArrayOfTemplate } = require('../model/data');
const { validationResult } = require('express-validator');

const block_template = {
  grid_x: Number,
  grid_y: Number,
  width: Number,
  height: Number,
  color: String,
  bouncy: Boolean,
  causes_damage: Boolean,
}

const level_template = {
  level_name: String,
  level_author: String,
  author_id: String,
  level_block_data: new ArrayOfTemplate(block_template),
}

const id_template = {
  id: ObjectId,
}


const getAllLevels = async (req, res) => {
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

const getLevelById = async (req, res) => {
  try {

    const [valid, output] = validate_request(req.params, id_template);
    if (!valid) {
      throw new Error(`Invalid request params: ${output}`);
    }

    await mongodb.getDb().db(database).collection(collection).find(
      {
        "_id": ObjectId(output.id)
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
          error: `Level not found with id ${output.id}`,
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


const createLevel = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const [valid, output] = validate_request(req.body, level_template);
    if (!valid) {
      throw new Error(`Invalid request body: ${output}`);
    }

    const alreadyExists = await mongodb.getDb().db(database).collection(collection).findOne({ level_name: output.level_name });
    if (alreadyExists) {
      throw new Error(`Level with name already exists: ${output.level_name}`);
    }

    const response = await mongodb.getDb().db(database).collection(collection).insertOne(output);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw new Error(response.error || 'Some error occurred while creating the level.');
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      body: req.body
    });
  }

};


const deleteLevel = async (req, res) => {
  try {

    if (!req.oidc.isAuthenticated()) {
      throw new Error(`Not authorized to delete, please log in at /login `);
    }

    const [valid, output] = validate_request(req.params, id_template);
    if (!valid) {
      throw new Error(`Invalid request params: ${output}`);
    }

    const levelId = new ObjectId(output.id);
    const response = await mongodb.getDb().db(database).collection(collection).deleteOne({ _id: levelId }, true);

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      const err_string = `ID: ${output.id} may not exist in the DB`;
      throw new Error(response.error || err_string);
    }

  } catch (err) {
    res.status(500).send({
      error: String(err),
      params: req.params
    });
  }
};

const updateLevel = async (req, res) => {
  try {

    if (!req.oidc.isAuthenticated()) {
      throw new Error(`Not authorized to update level, please log in at /login `);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const [params_valid, params_output] = validate_request(req.params, id_template);
    if (!params_valid) {
      throw new Error(`Invalid request params: ${params_output}`);
    }

    const [body_valid, body_output] = validate_request(req.body, level_template);
    if (!body_valid) {
      throw new Error(`Invalid request body: ${body_output}`);
    }

    const levelId = new ObjectId(params_output.id);
    const response = await mongodb.getDb().db(database).collection(collection).replaceOne({ _id: levelId }, body_output);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      const err_string = `ID: ${params_output.id} may not exist in the DB`;
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


module.exports = { getAllLevels, getLevelById, createLevel, deleteLevel, updateLevel };