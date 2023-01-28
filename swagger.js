const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Level API',
        description: `Kyle level saving API <hr>
        <br>Note: Some features require user to be authenticated.</br>
        To login navigate to <a href='/login' target="_blank">Login</a>
        To log out navigate to <a href='/logout' target="_blank">Log Out</a>`
    },
    host: 'cse341-level-api.onrender.com',
    schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);