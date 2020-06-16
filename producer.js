const amqp = require('amqplib');
const config = require('./config');
const appdynamics = require('./appdynamics_service');


function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   

const publishToQueue = async(queue, message, durable = false, {headers}) => {

    try {
    const cluster = await amqp.connect(config.rabbit.connectionString);
    const channel = await cluster.createChannel();

    await channel.assertQueue(queue, durable= false);
    await channel.sendToQueue(queue, Buffer.from(message), {headers});
    await sleep(1000);
    console.info(' [x] Sending message to queue', queue, message );
    } catch (error) {
        // handle error response
        console.error(error, 'Unable to connect to cluster!');
        process.exit(1);
    }


}


module.exports = publishToQueue; 

