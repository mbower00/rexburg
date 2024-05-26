// copied code from https://swagger-autogen.github.io/docs/getting-started/quick-start/

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';

swaggerAutogen(outputFile, ['./routes/index.js'], doc);