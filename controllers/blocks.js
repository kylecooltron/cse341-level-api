const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const database = "cse341-database";
const collection = "level_data";
const { validate_request } = require('../model/data');


const block_template = {
  level_id: String,
  name: String,
  grid_x: Number,
  grid_y: Number,
  width: Number,
  height: Number,
  color: String,
  bouncy: Boolean,
  causes_damage: Boolean,
}

const id_template = {
  id: String,
}

const getAllBlocks = async (req, res) => {
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

const getBlockById = async (req, res) => {
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
      res.status(500).json('Block not found.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


const createBlock = async (req, res) => {
  try {
    const [valid, output] = validate_request(req.body, block_template);

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
      res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    }

  } catch (err) {
    res.status(500).json(err);
  }
};


const deleteBlock = async (req, res) => {
  try {
    const [valid, output] = validate_request(req.params, id_template);

    if (!valid) {
      res.status(500).json(`Invalid request params: ${output}`);
      // for debugging
      console.log("Request Params were:");
      console.log(req.params);
      return
    }

    const contactId = new ObjectId(output.id);
    const response = await mongodb.getDb().db(database).collection(collection).deleteOne({ _id: contactId }, true);

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateBlock = async (req, res) => {
  try {
    const [params_valid, params_output] = validate_request(req.params, id_template);

    if (!params_valid) {
      res.status(500).json(`Invalid request params: ${params_output}`);
      // for debugging
      console.log("Request Params were:");
      console.log(req.params);
      return
    }

    const [body_valid, body_output] = validate_request(req.body, block_template);

    if (!body_valid) {
      res.status(500).json(`Invalid request body: ${body_output}`);
      // for debugging
      console.log("Request Body was:");
      console.log(req.body);
      return
    }

    const contactId = new ObjectId(params_output.id);
    const response = await mongodb.getDb().db(database).collection(collection).replaceOne({ _id: contactId }, body_output);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the contact.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


module.exports = { getAllBlocks, getBlockById, createBlock, deleteBlock, updateBlock };