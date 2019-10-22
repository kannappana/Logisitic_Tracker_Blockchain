/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const util = require('util');

var Chaincode = class {

  // Initialize the chaincode
  async Init(stub) {
    console.info('========= example_cc Init =========');
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let args = ret.params;
    // initialise only if 4 parameters passed.
    if (args.length != 4) {
      return shim.error('Incorrect number of arguments. Expecting 4');
    }

    let A = args[0];
    let B = args[2];
    let Aval = args[1];
    let Bval = args[3];

    if (typeof parseInt(Aval) !== 'number' || typeof parseInt(Bval) !== 'number') {
      return shim.error('Expecting integer value for asset holding');
    }

    try {
      await stub.putState(A, Buffer.from(Aval));
      try {
        await stub.putState(B, Buffer.from(Bval));
        return shim.success();
      } catch (err) {
        return shim.error(err);
      }
    } catch (err) {
      return shim.error(err);
    }
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let method = this[ret.fcn];
    if (!method) {
      console.error('no method of name:' + ret.fcn + ' found');
      return shim.error('no method of name:' + ret.fcn + ' found');
    }

    console.info('\nCalling method : ' + ret.fcn);
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async move(stub, args) {
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    let A = args[0];
    let B = args[1];
    if (!A || !B) {
      throw new Error('asset holding must not be empty');
    }

    // Get the state from the ledger
    let Avalbytes = await stub.getState(A);
    if (!Avalbytes) {
      throw new Error('Failed to get state of asset holder A');
    }
    let Aval = parseInt(Avalbytes.toString());

    let Bvalbytes = await stub.getState(B);
    if (!Bvalbytes) {
      throw new Error('Failed to get state of asset holder B');
    }

    let Bval = parseInt(Bvalbytes.toString());
    // Perform the execution
    let amount = parseInt(args[2]);
    if (typeof amount !== 'number') {
      throw new Error('Expecting integer value for amount to be transaferred');
    }

    Aval = Aval - amount;
    Bval = Bval + amount;
    console.info(util.format('Aval = %d, Bval = %d\n', Aval, Bval));

    // Write the states back to the ledger
    await stub.putState(A, Buffer.from(Aval.toString()));
    await stub.putState(B, Buffer.from(Bval.toString()));

  }

  // Deletes an entity from state
  async delete(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    let A = args[0];

    // Delete the key from the state in ledger
    await stub.deleteState(A);
  }

  // query callback representing the query of a chaincode
  async query(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting name of the person to query')
    }

    let jsonResp = {};
    let A = args[0];

    // Get the state from the ledger
    let Avalbytes = await stub.getState(A);
    if (!Avalbytes) {
      jsonResp.error = 'Failed to get state for ' + A;
      throw new Error(JSON.stringify(jsonResp));
    }

    jsonResp.name = A;
    jsonResp.amount = Avalbytes.toString();
    console.info('Query Response:');
    console.info(jsonResp);
    return Avalbytes;
  }


  async addShipment(stub, args) {
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    let shipmentId = args[0];
    let shipment = args[1];
      
    // Check the shipment is already avaiable in the ledger
    let shipmentbytes = await stub.getState(shipmentId);
    if (shipmentbytes.toString()) {
      throw new Error('shipment is already in transit');
    }

    // query the shipment history array
    let shipmentHistorybytes = await stub.getState("shipmentHistory");
    if (!shipmentHistorybytes.toString()) {
      let shipmentHistory = [];
      shipmentHistory.push(shipmentId);
      await stub.putState("shipmentHistory", Buffer.from(shipmentHistory.toString()));
    }
    else {
      let shipmentHistory = shipmentHistorybytes.toString().split(',');
      shipmentHistory.push(shipmentId);
      await stub.putState("shipmentHistory", Buffer.from(shipmentHistory.toString()));
    }

    // Write the state to the ledger
    
    await stub.putState(shipmentId, Buffer.from(shipment.toString()));

  }

  async updateShipment(stub, args) {
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    let shipmentId = args[0];
    let updateShipment = args[1];
      
    // Check the shipment is already avaiable in the ledger
    let shipmentbytes = await stub.getState(shipmentId);
    if (!shipmentbytes) {
      throw new Error('shipment is not available, Please check the ID');
    }

    // Write the state to the ledger
    await stub.putState(shipmentId, Buffer.from(updateShipment.toString()));

  }

  // query callback representing the query of a chaincode
  async queryShipment(stub, args) {
   // if (args.length != 1) {
   //   throw new Error('Incorrect number of arguments. Expecting shipmentId to query')
   // }

    let jsonResp = {};
    let shipmentId = args[0];

    // Get the state from the ledger
    let shipmentbytes = await stub.getState(shipmentId);
    console.log("****************Shipment DEtails*********************"+shipmentbytes);
    if (!shipmentbytes) {
      jsonResp.error = 'Failed to get state for ' + shipmentId;
      throw new Error(JSON.stringify(jsonResp));
    }

    return shipmentbytes;
  }

  async getShipmentHistory(stub, args) {

    let jsonResp = {};

    // Get the state from the ledger
    let shipmentHistorybytes = await stub.getState("shipmentHistory");
    if (!shipmentHistorybytes) {
      jsonResp.error = 'Failed to get shipment history ';
      throw new Error(JSON.stringify(jsonResp));
    }

    console.info('Query Response:');
    console.info(jsonResp);
    return shipmentHistorybytes;
  }

  async addTempurature(stub, args) {

      let shipmentId = args[0];
      let tempuratureJson = args[1];
      let tempurature = tempuratureJson.temp;
      let tempLimit = args[2];
      let timeLimit = args[3]
	        
      let shipmentbytes = await stub.getState(shipmentId);
      let shipment = JSON.parse(shipmentbytes[0].toString());
      let highTemp = shipment.hightempurature;
      let counter = shipment.counter;

      console.log("****************Shipment DEtails temp*********************"+shipment)
	      
      if (counter >= timeLimit) {
            shipment.timeRaster.push(tempuratureJson);
            shipment.tempuratureBreach = tempLimit;
      } else if (tempurature > tempLimit) {
	    counter = counter +1;
        shipment.timeRaster.push(tempuratureJson);
      } else if (tempurature > highTemp){
            counter = 0;
            shipment.timeRaster.push(tempuratureJson);
            shipment.hightempurature = tempurature;
            shipment.tempuratureBreach = tempurature;
      } else {
        counter = 0;
        shipment.timeRaster.push(tempuratureJson);
        shipment.hightempurature = tempurature;
        shipment.tempuratureBreach = tempurature;
      }

      console.log("****************After Shipment DEtails temp*********************"+shipment)
      
      await stub.putState(shipmentId, Buffer.from(shipment.toString()));

     }

};

shim.start(new Chaincode());
