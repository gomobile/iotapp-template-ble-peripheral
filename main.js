/*
 * Use the 'bleno' node module to advertise your IoT device's presence as a
 * BlueTooth Low Energy peripheral device.
 *
 * Reads and writes data via a Bluetooth Low Energy (BLE) communication
 * channel with a corresponding mobile companion Cordova mobile app. The
 * companion app is named 'BLE Central' and can be found under the samples
 * section for HTML5 Companion Mobile Apps.
 *
 * Supported Intel IoT development boards are identified in the code.
 *
 * See LICENSE.md for license terms and conditions.
 *
 * https://software.intel.com/en-us/xdk/docs/using-templates-nodejs-iot
 */

/* spec jslint and jshint lines for desired JavaScript linting */
/* see http://www.jslint.com/help.html and http://jshint.com/docs */
/* jslint node:true */
/* jshint unused:true */

"use strict" ;


var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var FirstCharacteristic = require('./characteristic');

console.log('bleno - ble peripheral');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('feedback', ['fc00']);
  }
  else {
    if(state === 'unsupported'){
      console.log("NOTE: BLE and Bleno configurations not enabled on board, see README.md for more details...");
    }
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'fc00',
        characteristics: [
          new FirstCharacteristic()
        ]
      })
    ]);
  }
});

bleno.on('accept', function(clientAddress) {
    console.log("Accepted Connection with Client Address: " + clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
    console.log("Disconnected Connection with Client Address: " + clientAddress);
});