//*****************************************************************************
// Copyright (c) 2014 IBM Corporation and other Contributors.
//
// All rights reserved. This program and the accompanying materials
// are made available under the terms of the Eclipse Public License v1.0
// which accompanies this distribution, and is available at
// http://www.eclipse.org/legal/epl-v10.html 
//
// Contributors:
//  IBM - Initial Contribution
//*****************************************************************************

// IoT Cloud QuickStart Driver
// A sample to run on a BeagleBone Black equipped with a BLE USB adaptor connecting a Texas Instruments SenstorTag CC2451

var util = require('util');
var async = require('async');
var SensorTag = require('sensortag');
var mqtt = require('mqtt');

var host = "messaging.quickstart.internetofthings.ibmcloud.com"; 
var port = "1883";
var client;
var deviceId;
var topic;

var tagData = {};
tagData.d = {};

tagData.toJson = function () {
  return JSON.stringify(this);
};

tagData.publish = function () {
  // dont publish unless there is a full set of data
  // alternative: only enable publish when most sensortag callbacks have fired

  if (tagData.d.hasOwnProperty("temp")) {
	client.publish(topic, tagData.toJson());
	//console.log(topic, tagData.toJson());
  }
};

require('getmac').getMac(function(err, macAddress) {
  if (err) throw err;
  deviceId = macAddress.replace(/:/g, '').toLowerCase();
  client = mqtt.createClient(port, host, { "clientId": "quickstart:"+deviceId, "keepalive": 30 } );
  topic = "iot-1/d/" + deviceId + "/evt/titag-quickstart/json";
});

console.log('Press the side button on the SensorTag to connect');
SensorTag.discover(function(sensorTag) {

  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

  // run functions in series
  async.series([
      function(callback) {
        console.log(deviceId);
        console.log('connect');
        sensorTag.connect(callback);
      },
      function(callback) {
        console.log('discoverServicesAndCharacteristics');
        sensorTag.discoverServicesAndCharacteristics(callback);
      },
      function(callback) {
        console.log('readDeviceName');
        sensorTag.readDeviceName(function(deviceName) {
          console.log('\tdevice name = ' + deviceName);
	  tagData.d.myName = deviceName;
          callback();
        });
      },
      function(callback) {
        console.log('readSystemId');
        sensorTag.readSystemId(function(systemId) {
          console.log('\tsystem id = ' + systemId);
          callback();
          tagData.d.myName += " " + systemId;
        });
      },
      function(callback) {
        console.log('readSerialNumber');
        sensorTag.readSerialNumber(function(serialNumber) {
          console.log('\tserial number = ' + serialNumber);
          callback();
        });
      },
      function(callback) {
        console.log('readFirmwareRevision');
        sensorTag.readFirmwareRevision(function(firmwareRevision) {
          console.log('\tfirmware revision = ' + firmwareRevision);
          callback();
        });
      },
      function(callback) {
        console.log('readHardwareRevision');
        sensorTag.readHardwareRevision(function(hardwareRevision) {
          console.log('\thardware revision = ' + hardwareRevision);
          callback();
        });
      },
      function(callback) {
        console.log('readSoftwareRevision');
        sensorTag.readHardwareRevision(function(softwareRevision) {
          console.log('\tsoftware revision = ' + softwareRevision);
          callback();
        });
      },
      function(callback) {
        console.log('readManufacturerName');
        sensorTag.readManufacturerName(function(manufacturerName) {
          console.log('\tmanufacturer name = ' + manufacturerName);
          callback();
        });
      },
      function(callback) {
        console.log('enableIrTemperature');
        sensorTag.enableIrTemperature(callback);
      },
      function(callback) {
        console.log('enableAccelerometer');
        sensorTag.enableAccelerometer(callback);
      },
      function(callback) {
        sensorTag.setAccelerometerPeriod(1000, callback);
      },
      function(callback) {
        console.log('enableHumidity');
        sensorTag.enableHumidity(callback);
      },
      function(callback) {
        console.log('enableMagnetometer');
        sensorTag.enableMagnetometer(callback);
      },
      function(callback) {
        sensorTag.setMagnetometerPeriod(1000, callback);
      },
      function(callback) {
        console.log('enableBarometricPressure');
        sensorTag.enableBarometricPressure(callback);
      },
      function(callback) {
        console.log('enableGyroscope');
        sensorTag.enableGyroscope(callback);
      },
      function(callback) {
        setTimeout(callback, 1000);
        setInterval(function(tag) {tag.publish();}, 1000, tagData);
      },
      function(callback) {
        sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
	      tagData.d.objectTemp =  parseFloat(objectTemperature.toFixed(1));
              tagData.d.ambientTemp =  parseFloat(ambientTemperature.toFixed(1));
        });

        sensorTag.notifyIrTemperature(function() {

        });

        callback();
      },
      function(callback) {
        sensorTag.on('accelerometerChange', function(x, y, z) {
	      tagData.d.accelX = parseFloat(x.toFixed(1));
	      tagData.d.accelY = parseFloat(y.toFixed(1));
	      tagData.d.accelZ = parseFloat(z.toFixed(1));
        });

        sensorTag.notifyAccelerometer(function() {

        });

        callback ();
      },
      function(callback) {
        sensorTag.on('humidityChange', function(temperature, humidity) {
	      tagData.d.humidity =  parseFloat(humidity.toFixed(1));
          tagData.d.temp = parseFloat(temperature.toFixed(1));
        });

        sensorTag.notifyHumidity(function() {

        });

        callback();
      },
      function(callback) {
        sensorTag.on('magnetometerChange', function(x, y, z) {
	      tagData.d.magX = parseFloat(x.toFixed(1));
	      tagData.d.magY = parseFloat(y.toFixed(1));
	      tagData.d.magZ = parseFloat(z.toFixed(1));
        });

        sensorTag.notifyMagnetometer(function() {

        });

        callback();
      },
      function(callback) {
        sensorTag.on('barometricPressureChange', function(pressure) {
	  		tagData.d.pressure =  parseFloat(pressure.toFixed(1));
        });

        sensorTag.notifyBarometricPressure(function() {

        });

        callback();
      },
      
      function(callback) {
        sensorTag.on('gyroscopeChange', function(x, y, z) {
	  	  tagData.d.gyroX = parseFloat(x.toFixed(1));
	      tagData.d.gyroY = parseFloat(y.toFixed(1));
	      tagData.d.gyroZ = parseFloat(z.toFixed(1));
        });

        sensorTag.notifyGyroscope(function() {

        });
        callback();
      },
      
      function(callback) {
        sensorTag.on('simpleKeyChange', function(left, right) {
          console.log('keys left: ' + left + '  right: ' + right);

          if (left && right) {
            sensorTag.notifySimpleKey(callback);
          }
        });

        sensorTag.notifySimpleKey(function() {

        });
      },
      function(callback) {
        console.log('disconnect');
        sensorTag.disconnect(callback);
      }
    ]
  );
});


