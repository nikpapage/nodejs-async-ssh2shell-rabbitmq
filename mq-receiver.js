#!/usr/bin/env node



const appdynamics = require("appdynamics")
appdynamics.profile({
    controllerHostName: process.env.APPDYNAMICS_CONTROLLER_HOST_NAME,
    controllerPort: process.env.APPDYNAMICS_CONTROLLER_PORT,
        // If SSL, be sure to enable the next line
    controllerSslEnabled: process.env.APPDYNAMICS_CONTROLLER_SSL_ENABLED,
    accountName: process.env.APPDYNAMICS_AGENT_ACCOUNT_NAME,
    accountAccessKey: process.env.APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY,
    applicationName: process.env.APPDYNAMICS_AGENT_APPLICATION_NAME,
    
    tierName: 'Queue_Receiver',
    nodeName: 'receiver',
    debug: true
});





var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
	    console.log(msg.properties.headers['singularityheader']);
            correlationInfo=appdynamics.parseCorrelationInfo(msg.properties.headers['singularityheader']);

            var txn= appdynamics.startTransaction(correlationInfo);

	    console.log("---AppDynamics Consumer Transaction Started---");
	    txn.end();
        }, {
            noAck: true
        });
    });
});
