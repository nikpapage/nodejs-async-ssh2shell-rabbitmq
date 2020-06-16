const path = require('path');
require('dotenv').config({path:path.resolve(__dirname, '../.env')})

const config= {
    rabbit: {
    connectionString: 'amqp://localhost',
	queue: 'hello'
    }
}

module.exports = config;
