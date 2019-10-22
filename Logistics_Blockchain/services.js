var hfc = require('fabric-client');
var fs = require("fs");
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var helper = require('./app/helper.js');
var query = require('./app/query.js');

function getErrorMessage(field) {
	var response = {
	     success: false,
	     message: field + ' field is missing or Invalid in the request'
	    };
	return response
}

async function login (role,username, password, app,jwt ) {
        logger.debug('End point : /users');
        logger.debug('User name : ' + username);
        logger.debug('password  : ' + password);
        if (!username) {
            return getErrorMessage('\'username\'');	           
	}
	if (!password) {
	    return getErrorMessage('\'password\'');		           
	}
	if (!role) {
	    return getErrorMessage('\'role\'');
	}
        let response;
	let orgname;

	switch (role) {
	 case 'buyer':
	    	orgname = 'Org3'
		break;
 	 case 'seller':
            	orgname = 'Org1'
	 	break;
	 case 'logistic':
		orgname = 'Org2'
		break;
	 default:
		break;
	
	}
	var usersdetail=hfc.getConfigSetting('admins');
	console.log(usersdetail[0].username)
	if (usersdetail[0].username == username && usersdetail[0].secret == password) {
	    var token = jwt.sign({
	          exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
	          username: username,
	          orgName: orgname
	       }, app.get('secret'));
	    response = { resMessage: "done" ,OrgName:orgname};
	}
	else { response = { resMessage: "failed" }; }        
        let resp = await helper.getRegisteredUser(username, orgname, true);
	logger.debug('-- returned from registering the username %s for organization %s',username,password);
	if (resp && typeof resp !== 'string') {
	    logger.debug('Successfully registered the username %s for organization %s',username,password);
	    response.token = token;
 	    return response;
	} else {
            logger.debug('Failed to register the username %s for organization %s with::%s',username,password,response);
            return ({success: false, message: resp});
        }
 };

async function getShipmentDetails(shipmentList,role) {
    let peers;
    let orgname;
    let sellerData = [];
    let buyerData = [];
    let logisticData = [];

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

	console.log("Org:"+orgname+"Peers:"+peers);
     	var chaincodeName =  hfc.getConfigSetting('chaincode');; //req.params.chaincodeName;
	var channelName =  hfc.getConfigSetting('channelName');; //req.params.channelName;
        var fcn = "queryShipment";
	for(const shipmentID of shipmentList){
            console.log("Check"+shipmentID);
            var args = [];
	    args.push(shipmentID);
            let message = await query.queryChaincode(peers, channelName, chaincodeName, args, fcn,  "admin", orgname);
            let data = JSON.parse(message);
            let status = data.status;
            switch(status) {
                case "in-store":
                    sellerData.push(data);
                    break;
                case "in-transit":
                    sellerData.push(data);
                    logisticData.push(data);
                    break;
                case "delivered":
                    buyerData.push(data);
		    sellerData.push(data);
		    logisticData.push(data);
                    break;
                case "rejected":
                    buyerData.push(data);
                    sellerData.push(data);
                    logisticData.push(data);
                    break;
                case "accepted":
                    buyerData.push(data);
                    sellerData.push(data);
                    logisticData.push(data);
                    break;
                default:
                    break;
            }
       };
    if (role == "seller") {
            return sellerData;
        } 
    else if (role == "buyer") {
            console.log("buyer"+buyerData);
            return buyerData;
        }
   else {
            console.log("logistic"+logisticData);
            return logisticData;
        }
		
};



exports.login = login;
exports.getErrorMessage = getErrorMessage;
exports.getShipmentDetails = getShipmentDetails;
