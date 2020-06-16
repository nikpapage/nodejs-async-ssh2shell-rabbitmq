const appdynamics = require('./appdynamics_service');
const express = require('express');
const app = express();
var ssh = require('./ssh');



app.post('/echo', function (request, response) {
    console.log("Step 1:----Received Request---");
     var data ='Hello World'
     console.log("Step 2:---Preparing Internal HTTP Exit Call---")
     //Async Exit call to capture everything that goes on on SSH2SHELL
      
     console.log("Step 3:---Preparing Downstram(SSH2SHELL) Correlation Header---");
     var asyncExitCall= appdynamics.getAsyncCorrelation(request);
     console.log("Step 4:---Firing SSH Command");
     var txn =  appdynamics.appdynamics.getTransaction(request);
     ssh.executeMultipleCommands(asyncExitCall,txn);
     
     response.send('Hello World!');
});
app.listen(3000, function(){
	console.log('App Listening to port 3000');
});
