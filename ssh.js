const appdynamics = require('./appdynamics_service');
const config = require('./config');
const produce = require('./producer');
var Client = require('ssh2').Client;
var SSH2Shell = require('ssh2shell');



function executeMultipleCommands(asyncExitCall,asyncTxn) {
    var host = {
        server: {
            host:         '127.0.0.1',
            port:         22,
            userName:     process.env.ssh_username,
            password:     process.env.ssh_password
      },
      idleTimeOut:       500000,
      commands:       ["sleep 1"],
      onCommandComplete:   function( command, response, sshObj ) {
           console.log("Step 1:---On Command Complete---");
           console.log("Step 2:---Call Module addExit And Correlation Header---");
            var i=0;
	    while (i <2){  
            //This is the exit call to the rabbit mq, and needs to be modified accordingly to match the implementation of the publisher
           appdynamics.addExitandCorrelationHeader( asyncTxn, { host: 'localhost', port: 5672, queue: 'logs', routingKey: 'routing key'}, true).then(function(result) {
               const { headers, endExitCall } = result
               console.log("Step 5:---Publishing message to queue---");
               var data='Hello World';
               produce(config.rabbit.queue, data, durable = false, { headers });
               console.log("Step 6:---Complete AppDynamics Exit Call---");
	       endExitCall();
               console.log("Step 7:---Complete AppDynamics transaction---");
               console.log("Step 8:---Complete ssh2shell exit call---");
         })
         i++;
         }
	 asyncTxn.endExitCall(asyncExitCall);
       },
   };
    SSH = new SSH2Shell(host);
    SSH.connect();

}

module.exports = {
    executeMultipleCommands: executeMultipleCommands,
};
