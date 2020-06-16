#!/usr/bin/env node



const appdynamics = require("appdynamics")
appdynamics.profile({
    controllerHostName: 'nik-2044nosshcontroller-l6r6yjt4.appd-sales.com',
    controllerPort: 8090,
    controllerSslEnabled: false,
    accountName: 'customer1',
    accountAccessKey: '7b539d48-1b18-4c12-ac76-d13739db4a7d',
    applicationName: 'NodeJS_WebApp_Nik',
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
