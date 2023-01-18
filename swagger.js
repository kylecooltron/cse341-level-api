const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Level API',
        description: 'Kyle level saving API'
    },
    host: 'cse341-level-api.onrender.com',
    schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);