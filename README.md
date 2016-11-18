Intel® XDK IoT Node.js\* BLE Peripheral App
===========================================
See [LICENSE.md](LICENSE.md) for license terms and conditions.

This sample application is distributed as part of the
[Intel® XDK](http://xdk.intel.com). It can also be downloaded
or cloned directly from its git repo on the
[public Intel XDK GitHub\* site](https://github.com/gomobile).

For help getting started developing applications with the
Intel XDK, please start with
[the Intel XDK documentation](https://software.intel.com/en-us/xdk/docs).

App Overview
------------
A simple nodeJS project that uses the bleno node module on Intel
IoT platforms to advertise it's presence, read and write data via
it's service and corresponding characteristic for Bluetooth Low
Energy (BLE) communication.

###Intel(R) Edison
In order to leverage this project successfully, you will need to
enable bluetooth and disable the bluetooth daemon on Intel(R) Edison.

###Intel(R) Galileo
In order to leverage this project successfully, you will need to
use a compatible BLE product such as the
[Grove - BLE](http://www.seeedstudio.com/depot/Grove-BLE-p-1929.html)


###Intel(R) Edison & Intel(R) Galileo
####First time - Enabling BLE
Within a SSH or Serial Terminal connection, type the following commands,
```
rfkill unblock bluetooth
hciconfig hci0 up

vi /etc/opkg/base-feeds.conf (insert only following lines)
src/gz all http://repo.opkg.net/edison/repo/all
src/gz edison http://repo.opkg.net/edison/repo/edison
src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32
```
*For more information on the vi editor, visit* http://www.cs.colostate.edu/helpdocs/vi.html

```
opkg update
opkg install bluez5-dev
```

**Note:** If bluez fails to install this version, still proceed with remainding steps.

####Prerequisite for Bleno - node package to work successfully
**Note:** The following steps will need to be executed every time the board is restarted.
Within a SSH or Serial Terminal connection, type the following commands,
```
rfkill unblock bluetooth
killall bluetoothd (or, more permanently) systemctl disable bluetooth
hciconfig hci0 up
```

You should now be able to use BLE in your project.

####(Intel XDK IoT Edition) Install node modules
Within the "manage your xdk daemon and IoT device" menu, check the following boxes
* Clean '/node_modules' before building
* Run npm install directly on IoT Device (requires internet connection on device)

You can installed the required node modules for this project which are found in the package.json file by pressing the Build/Install button.

####(Intel XDK IoT Edition) Upload & Run project
After installing the neccessary node modules, press the upload and run buttons to execute your project on your board.

**Mobile Companion App** BLE-Central - https://github.com/gomobile/sample-ble-central
*  The mobile companion app, BLE-Central is under Statrt A New Project > HTML5 Companion Hybrid Mobile or Web App > Samples and Demos > General > HTML5 + Cordova section.

####Getting Started with Bleno Cordova* Plug-in
#####Design Considerations
The **first operation** is to set up an eventlistener for the "stateChange" event. Within this function block, it is recommended to startAdvertising your service only when the state is in powerOn.
```javascript
bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('feedback', ['fc00']);
  } else {
    bleno.stopAdvertising();
  }
});
```
The **second operation** is to set up an eventlistener for the "advertisingStart" event. Within this function block, set your primary service with it's unique UUID and characteristics attributes.
```javascript
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
```

**Service Characteristic setup**
```javascript
var FirstCharacteristic = function() {
  FirstCharacteristic.super_.call(this, {
    uuid: 'fc0f',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer("Hello World from Edison!", "utf-8");
  console.log("Characterisitic's value: "+this._value);

  this._updateValueCallback = null;
};
```

**Communication request handlers for the BLE peripheral can be managed by the following functions:**
```javascript
FirstCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('FirstCharacteristic - onReadRequest: value = ' + this._value.toString("utf-8"));

  callback(this.RESULT_SUCCESS, this._value);
};

FirstCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;
    console.log('FirstCharacteristic - onWriteRequest: value = ' + this._value.toString("utf-8"));

  if (this._updateValueCallback) {
    console.log('FirstCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

FirstCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('FirstCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

FirstCharacteristic.prototype.onUnsubscribe = function() {
  console.log('FirstCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};
```



The **third operation** is to set up an eventlisrerner for the "connect" and "disconnect" event.
```javascript
bleno.on('accept', function(clientAddress) {
    console.log("Accepted Connection with Client Address: " + clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
    console.log("Disconnected Connection with Client Address: " + clientAddress);
});
```

Important Sample App Files
--------------------------
* main.js
* characteristic.js
* package.json

Important Sample Project Files
------------------------------
* README.md
* LICENSE.md
* project-name.xdk
* project-name.xdke
