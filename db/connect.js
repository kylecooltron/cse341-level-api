
const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = async (callback) => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }
  //eslint-disable-next-line no-undef
  await MongoClient.connect(process.env.MONGODB_URI)
    .then(client => {
      _db = client;
      callback(null, _db);
    })
    .catch(err => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error('Db not initialized');
  }
  return _db;
};

const closeDb = () => {
  if (_db) {
    _db.close();
  }
}

module.exports = {
  initDb,
  getDb,
  closeDb
};