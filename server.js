const express = require('express');
const app = express();
const mongodb = require('./db/connect');

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Acccept, Z-Key'
    );
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONs');
    next();
  })
  .use('/', require('./routes'));

// eslint-disable-next-line no-unused-vars
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`)
    })
  }
});


