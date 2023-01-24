const express = require('express');
const app = express();
const mongodb = require('./db/connect');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const { auth } = require('express-openid-connect');

const dotenv = require('dotenv');
dotenv.config();

// const jwt = require('express-jwt');
// const jwks = require('jwks-rsa');


// const jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: 'https://dev-zrbvxednob43sk7a.us.auth0.com/.well-known/jwks.json'
//   }),
//   audience: 'https://cse341-level-api.onrender.com/',
//   issuer: 'https://dev-zrbvxednob43sk7a.us.auth0.com/',
//   algorithms: ['RS256']
// });

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASEURL,
  clientID: process.env.CLIENTID,
  issuerBaseURL: process.env.ISSUER
};

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
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
  .use(auth(config))
  // .use(jwtCheck)
  .use('/', require('./routes'));

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.



// this seems to catch error messages I created myself before they are sent in response
// // eslint-disable-next-line no-undef
// process.on('uncaughtException', (err, origin) => {
//   // eslint-disable-next-line no-undef
//   console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
// });

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


