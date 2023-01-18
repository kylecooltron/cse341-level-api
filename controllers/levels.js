const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const database = "cse341-database";
const collection = "level_data";
const { validate_request, ArrayOfTemplate } = require('../model/data');

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
  level_block_data: new ArrayOfTemplate(block_template),
}

const id_template = {
  id: String,
}

const getAllLevels = async (req, res) => {
  try {
    const response = await mongodb.getDb().db(database).collection(collection).find();
    response.toArray().then((list) => {
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
      res.status(500).json(`Invalid request params: ${output}`);
      // for debugging
      console.log("Request Params were:");
      console.log(req.params);
      return
    }

    const response = await mongodb.getDb().db(database).collection(collection).find(
      {
        "_id": ObjectId(output.id)
      }
    ).toArray();

    if (response.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(response[0]);
    } else {
      res.status(500).json('Level not found.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


const createLevel = async (req, res) => {
  try {
    const [valid, output] = validate_request(req.body, level_template);

    if (!valid) {
      res.status(500).json(`Invalid request body: ${output}`);
      // for debugging
      console.log("Request Body was:");
      console.log(req.body);
      return
    }

    const response = await mongodb.getDb().db(database).collection(collection).insertOne(output);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the level.');
    }

  } catch (err) {
    res.status(500).json(err);
  }
};


const deleteLevel = async (req, res) => {
  try {
    const [valid, output] = validate_request(req.params, id_template);

    if (!valid) {
      res.status(500).json(`Invalid request params: ${output}`);
      // for debugging
      console.log("Request Params were:");
      console.log(req.params);
      return
    }

    const levelId = new ObjectId(output.id);
    const response = await mongodb.getDb().db(database).collection(collection).deleteOne({ _id: levelId }, true);

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the level.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateLevel = async (req, res) => {
  try {
    const [params_valid, params_output] = validate_request(req.params, id_template);

    if (!params_valid) {
      res.status(500).json(`Invalid request params: ${params_output}`);
      // for debugging
      console.log("Request Params were:");
      console.log(req.params);
      return
    }

    const [body_valid, body_output] = validate_request(req.body, level_template);

    if (!body_valid) {
      res.status(500).json(`Invalid request body: ${body_output}`);
      // for debugging
      console.log("Request Body was:");
      console.log(req.body);
      return
    }

    const levelId = new ObjectId(params_output.id);
    const response = await mongodb.getDb().db(database).collection(collection).replaceOne({ _id: levelId }, body_output);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the level.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


module.exports = { getAllLevels, getLevelById, createLevel, deleteLevel, updateLevel };