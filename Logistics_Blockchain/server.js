/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');
var moment        = require('moment');
const cron = require('node-cron');
const request = require('request');

require('./config.js');
var hfc = require('fabric-client');

var helper = require('./app/helper.js');
var createChannel = require('./app/create-channel.js');
var join = require('./app/join-channel.js');
var updateAnchorPeers = require('./app/update-anchor-peers.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var invoke = require('./app/invoke-transaction.js');
var query = require('./app/query.js');
var host = process.env.HOST || hfc.getConfigSetting('host');
var port = process.env.PORT || hfc.getConfigSetting('port2');
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));

// set secret variable
app.set('secret', 'thisismysecret');

app.use(expressJWT({
	secret: 'thisismysecret'
}).unless({
	path: ['/','/users','/login','/addShipment','/getShipment','/updateShipment','/addTemperature']
}));
app.use(bearerToken());

app.use(function(req, res, next) {
	logger.debug(' ------>>>>>> new request for %s',req.originalUrl);
	if (req.originalUrl.indexOf('/addShipment') >= 0) 	{
        	return next();
    	}
	else if (req.originalUrl.indexOf('/') >= 0) {
        	return next();
    	}
	else if (req.originalUrl.indexOf('/login') >= 0) {
        	return next();
    	}
        else if (req.originalUrl.indexOf('/getShipment') >= 0) {
	        return next();
	}
	else if (req.originalUrl.indexOf('/updateShipment') >= 0) {
	        return next();
	}
        else if (req.originalUrl.indexOf('/addTemperature') >= 0) {
		                return next();
		        }




	var token = req.token;
	jwt.verify(token, app.get('secret'), function(err, decoded) {
		if (err) {
			res.send({
				success: false,
				message: 'Failed to authenticate token. Make sure to include the ' +
					'token returned from /users call in the authorization header ' +
					' as a Bearer token'
			});
			return;
		} else {
			// add the decoded user name and org name to the request object
			// for the downstream code to use
			req.username = decoded.username;
			req.orgname = decoded.orgName;
			logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
			return next();
		}
	});
});


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function() {});
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************',host,port);
server.timeout = 240000;

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}


const cronS = (shipmentId,flag) => {
    let task = cron.schedule('0 * * * * *', () => {
                 let request1 = 'http://40.117.194.238:5000/addTemperature?shipmentId='+shipmentId+'&flag='+flag; 
	     	 if (flag == 4) {
			 flag = 0;
		 } else {
		  	 flag = flag+1;
	        }
                 request.post(request1, { json: true }, (err, res, body) => {
	             if (err) { return console.log(err); }
	             console.log(res.body)
             });
             }, {
	     	    scheduled: false
             });
	    console.log(task);
	    return task;
}




///////////Logistic API////////////////
	

var services = require('./services.js');

app.post('/login', async function(req, res) {
	logger.info('Request'+ req.body);
	logger.info('We are in'+req.body.role+ '' +req.body.username+ '' +req.body.password);	
        let message = await services.login(req.body.role, req.body.username, req.body.password,app,jwt);
        res.send(message);
});

app.get('/', async function(req, res) {
        let message = 'success'
        res.send(message);
});

app.post('/addShipment', async function(req, res){	
    try {
        console.log('==================== INVOKE ON CHAINCODE ==================');
        var peers = ["peer0.org1.example.com","peer0.org2.example.com","peer0.org3.example.com"]; //req.body.peers;
        var chaincodeName = "mycc"; //req.params.chaincodeName;
        var channelName = "mychannel"; //req.params.channelName;
        var fcn = "addShipment";//req.body.fcn
        var args = []; //JSON.stringify(req.body.args);

	args.push(req.body.shipmentId);
        args.push(JSON.stringify(req.body));
		            
        console.log("--------------"+args);
	console.log("--------------"+req.username+"------"+req.orgname);
	    
	
	let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, "admin", "Org1");
	console.log("message.."+message);
	
	var messageArray = {
		"success": message,
		"data" : req.body
	};
	let job = cronS(req.body.shipmentId,0);
	job.start();
	console.log("messageArray.."+messageArray);
	res.json(messageArray);
   }
   catch (e){
        console.log(e);
   }
});

app.get('/getShipment', async function(req, res) { 
    console.log("getShipment for" +req.query.role);

    let role = req.query.role;
    let peers;
    let orgname;

    switch (role) {
            case 'seller':
                peers = "peer0.org1.example.com";
                orgname = "Org1";
                break;
            case 'logistic':
                peers = "peer0.org2.example.com";
                orgname = 'Org2';
                break;
            case 'buyer':
                peers = "peer0.org3.example.com";
                orgname = 'Org3';
                break;
            default:
                break;
        }

	var chaincodeName =  hfc.getConfigSetting('chaincode');; //req.params.chaincodeName;
	var channelName =  hfc.getConfigSetting('channelName');; //req.params.channelName;
        var fcn = "getShipmentHistory";
//	var fcn = "queryShipment";
        var args = "%5B%22a%22%5D";
//	var args = ["123456"];
	let message = await query.queryChaincode(peers, channelName, chaincodeName, args, fcn, "admin", orgname);
	let shipmentList = message.split(',');
//	console.log("ShipmentList"+shipmentList[0]+"TypeOF"+typeof(shipmentList));
	let shipment = await services.getShipmentDetails(shipmentList,role);
	res.send(shipment);	
});


app.post('/updateShipment', async function(req, res){	
    try {
            console.log('==================== INVOKE ON CHAINCODE ==================');
            var peers = ["peer0.org1.example.com","peer0.org2.example.com","peer0.org3.example.com"]; //req.body.peers;
            var chaincodeName = "mycc"; //req.params.chaincodeName;
            var channelName = "mychannel"; //req.params.channelName;
            var fcn = "updateShipment";//req.body.fcn
            var args = []; //JSON.stringify(req.body.args);
	    let role = req.body.role;
	    let orgname;
	    switch (role) {
	            case 'seller':
	                orgname = "Org1";
	                break;
	            case 'logistic':
	                orgname = 'Org2';
	                break;
	            case 'buyer':
	                orgname = 'Org3';
	                break;
	            default:
	                break;
	        }

            args.push(req.body.data[0].shipmentId);
            args.push(JSON.stringify(req.body.data[0]));
            console.log("--------------"+args);
            let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, "admin", orgname);
            console.log("message.."+message);
            var messageArray = {
                "success": message,
                "data" : req.body
            };
            console.log("messageArray.."+messageArray);
            res.json(messageArray);
        }
    catch (e){
            console.log(e);
        }
});



app.post('/addTemperature', async function(req, res) { 
	    console.log("addTemperature for" +req.query.shipmentId);
	    let shipmentId = req.query.shipmentId;
	    let flag = req.query.flag;
	    let role = "seller";
	    let peers = "peer0.org1.example.com";
	    let orgname = "Org1";
		let chaincodeName =  hfc.getConfigSetting('chaincode');; //req.params.chaincodeName;
		let channelName =  hfc.getConfigSetting('channelName');//req.params.channelName;
	    var fcn = "queryShipment";
	    let tempuratureData =  hfc.getConfigSetting('tempuratureData');
	    let tempurature = tempuratureData[0][shipmentId][flag];
	    console.log("addTemperature for" + tempurature);
	    let date = moment();
	    let transmitTime = date.format('hhmmss');

	    let tempJson = {
		            "time": transmitTime,
		            "temp": tempurature
		        }
	    let tempLimit = hfc.getConfigSetting('tempLimit');
	    let timeLimit = hfc.getConfigSetting('timeLimit');
	    var args = [];
	/*    args.push(shipmentId);
	    args.push(JSON.stringify(tempJson));
	    args.push(tempLimit);
	    args.push(timeLimit);*/
	args.push(shipmentId);
	    let message = await query.queryChaincode(peers, channelName, chaincodeName, args, fcn,  "admin", orgname);
	    let data = JSON.parse(message);
	console.log("*****************************"+JSON.stringify(data));


	let highTemp = data.hightempurature;
        let counter = data.counter;

   	 if (counter >= timeLimit) {
		console.log(counter+"counter >= timeLimit"+ timeLimit);
	        data.timeRaster.push(tempJson);
     		data.tempuratureBreach = tempLimit;
    } else if (tempurature >= tempLimit) {
	  console.log(tempurature+"tempurature > tempLimit"+ tempLimit);
          data.counter = counter +1;
	  data.timeRaster.push(tempJson);
    } else if (tempurature > highTemp){
          data.counter = 0;
          data.timeRaster.push(tempJson);
          data.hightempurature = tempurature;
          data.tempuratureBreach = tempurature;
    } else {
          data.counter = 0;
          data.timeRaster.push(tempJson);
          data.hightempurature = tempurature;
          data.tempuratureBreach = tempurature;
    }

	console.log("**************After***************"+JSON.stringify(data));


	let addfcn = "updateShipment";
	let finalArgs = [];
	finalArgs.push(shipmentId);
	finalArgs.push(JSON.stringify(data));
	let tempPeers = ["peer0.org1.example.com","peer0.org2.example.com","peer0.org3.example.com"];

	let tempMessage = await invoke.invokeChaincode(tempPeers, channelName, chaincodeName, addfcn, finalArgs, "admin", orgname);
        console.log("message.."+tempMessage);
        var messageArray = {
            "success": tempMessage,
            "data" : req.body
        };
        console.log("messageArray.."+messageArray);
        res.json(messageArray);


});
