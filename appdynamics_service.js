
const appdynamics = require("appdynamics")
appdynamics.profile({
    controllerHostName: 'nik-2044nosshcontroller-l6r6yjt4.appd-sales.com',
    controllerPort: 8090,
    controllerSslEnabled: false,
    accountName: 'customer1',
    accountAccessKey: '7b539d48-1b18-4c12-ac76-d13739db4a7d',
    applicationName: 'NodeJS_WebApp_Nik',
    tierName: 'Backend-Services',
    nodeName: 'server',
    debug: true
});



function getAsyncCorrelation(request) {

    var asyncExitCall = appdynamics.getTransaction(request).startExitCall({
        exitType: 'EXIT_HTTP',
        label: 'ssh2shell', // should never display
        backendName: 'ssh2shell', // should never display
        identifyingProperties: {
            'HOST': 'localhost',
            'PORT': 22 // or whatever port this service listens on
        }
    });

    console.log("------Preparing Downstram(SSH2SHELL) Exit Call Header");
    return  asyncExitCall;
}


function addExitandCorrelationHeader(txn, identifyingProperties, debug = false) {
    return new Promise((resolve, reject) => {
    let headers = {}
    let exitCall = null;
    let correlationHeader = null;
    try {
        if (txn) {
            backendName = "amqp://"
            if(identifyingProperties.host) {
              txn.addSnapshotData("amqp-host", identifyingProperties.host)
              backendName += identifyingProperties.host
            }
            if(identifyingProperties.port) {
              txn.addSnapshotData("amqp-port", identifyingProperties.port)
              backendName += ":" + identifyingProperties.port
            }
            if(identifyingProperties.queue) {
              txn.addSnapshotData("amqp-queue", identifyingProperties.queue)
               backendName += "/" + identifyingProperties.queue
            }
            if(identifyingProperties['routing key']) {
              txn.addSnapshotData("amqp-routing-key", identifyingProperties['routing key'])
            }
            exitCall = txn.startExitCall({
                exitType: "EXIT_RABBITMQ",
                backendName,
                identifyingProperties
            });
            if(exitCall) {
              correlationHeader = txn.createCorrelationInfo(exitCall);
              //correlationHeader = correlationHeader.replace("etypeorder=RABBITMQ", "etypeorder=JMS*esubtype=JMS")
              if(debug) {
                //console.log(exitCall)
                //console.log('Adding correlation header: ' + correlationHeader);
              }
              if(correlationHeader) {
                headers.singularityheader = correlationHeader;
              }
            }
        } else if(debug) {
          console.log('Could not get txn object from appdynamics agent.');
        }
       else if(debug) {
        console.log('No appdynamics agent provided, exit call not detected.');
      }
    } catch(e) {
      if(debug) {
        console.log(e)
      }
    }
    const endExitCall = function() {
      console.log('End Exit Call');
      console.log('--------EXIT CALL-------');
      if(txn) {
	try{      
       	 txn.endExitCall(exitCall);
       }catch(e){
	   if(debug){
	    //   console.log(e);
	   }
       }
      }
    }
    resolve({ headers, endExitCall })
  })
}
module.exports = {
    addExitandCorrelationHeader,
    getAsyncCorrelation,
    appdynamics
}
