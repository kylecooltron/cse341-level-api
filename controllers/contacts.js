const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const database = "cse341-database";
const collection = "contacts";
var faker = require('faker');
const { validate_request } = require('../model/data');


const contact_template = {
  firstName: String,
  lastName: String,
  email: String,
  favoriteColor: String,
  birthday: Date,
}

const id_template = {
  id: String,
}

const getAllContacts = async (req, res) => {
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

//(req, res, next)

const getContactById = async (req, res) => {
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
      res.status(500).json('Contact not found.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


const createContact = async (req, res) => {
  try {
    const [valid, output] = validate_request(req.body, contact_template);

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


const deleteContact = async (req, res) => {
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

const updateContact = async (req, res) => {
  try {
    const [params_valid, params_output] = validate_request(req.params, id_template);

    if (!params_valid) {
      res.status(500).json(`Invalid request params: ${params_output}`);
      // for debugging
      console.log("Request Params were:");
      console.log(req.params);
      return
    }

    const [body_valid, body_output] = validate_request(req.body, contact_template);

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


const createRandomizedContact = async (req, res) => {
  try {
    // generate random contact data
    const contact = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      favoriteColor: faker.commerce.color(),
      birthday: faker.date.between('1950-01-01', '2020-01-01')
    };

    const [valid, output] = validate_request(contact, contact_template);

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


module.exports = { getAllContacts, getContactById, createContact, deleteContact, updateContact, createRandomizedContact };