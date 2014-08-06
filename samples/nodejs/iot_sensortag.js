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
//      - update for iot-2, registration and commands
//*****************************************************************************

// IoT Cloud Example Client
// To run on a BeagleBone Black equipped with a BLE USB adaptor connecting a Texas Instruments SenstorTag CC2451

var util = require('util');
var async = require('async');
var SensorTag = require('sensortag');
var mqtt = require('mqtt');
var getmac = require('getmac');
var properties = require('properties');
var fs = require('fs');

// constants
var u_port = "1883";
var s_port = "8883";
var pub_topic = "iot-2/evt/sample/fmt/json";
var sub_topic = "iot-2/cmd/blink/fmt/json";
var qs_org = "quickstart";
var reg_domain = ".messaging.internetofthings.ibmcloud.com";
var qs_host = "quickstart.messaging.internetofthings.ibmcloud.com";
var qs_type = "iotsample-ti-bbst";
var configFile = "./device.cfg";
var ledPath ="/sys/class/leds/beaglebone:green:usr";


// globals
var qs_mode = true;
var tls = false;
var org = qs_org;
var type = qs_type;
var host = qs_host;
var deviceId;
var password;
var username;


// LED functions
// run asynchronously, callbacks just trap unexpected errors
function ledWrite(extra, content, callback) {
  fs.writeFile(ledPath+extra, content, function(err) {
	if (err) throw err;
  });
  if (callback) callback();
}

// set the trigger: none, nand-disk, mmc0, mmc1, timer, oneshot, cpu, heartbeat, backlight, gpio ...
function ledTrigger(led, trigger, callback) {
	ledWrite(led+"/trigger", trigger, callback);
}

// with oneshot trigger
function ledShot(led, callback) {
	ledWrite(led+"/shot", "1", callback);
}

// set blink or not
function ledBlink(led, rate) {
	//console.log("LED " + rate);
	if (rate) {
	  ledWrite(led+"/delay_on", parseInt(400/rate));
      ledWrite(led+"/delay_off", parseInt(400/rate));
	} else {
	  ledWrite(led+"/delay_on", 1);
	  ledWrite(led+"/delay_off", 10000);	
	}
}

// initial modes
ledTrigger(0, "timer");
ledTrigger(1, "none");
ledTrigger(2, "none");
ledTrigger(3, "oneshot");


// event data object
var tagData = {};
tagData.d = {};
tagData.toJson = function() {
	return JSON.stringify(this);
};
tagData.publish = function() {
	// dont publish unless there is a full set of data
	// alternative: only enable publish when most sensortag callbacks have fired

	if (tagData.d.hasOwnProperty("temp")) {
		client.publish(pub_topic, tagData.toJson());
		ledShot(3);
		//console.log(pub_topic, tagData.toJson()); // trace
	}
};

// error report
function missing(what) {
	console.log("No " + what + " in " + configFile);
	process.exit(1);
}

// called on message received
function doCommand(topic, message, packet) {
	console.log("received command: " + topic + " msg: " + message);
	var topics = topic.split('/');
	switch(topics[2]) {
	case "blink": 
		var payload = JSON.parse(message);
		ledBlink(0, payload.interval);
		break;
	default:
		console.log("Unxpected Command: " + topics[2]);
	}
}

console.log('Press the side button on the SensorTag to connect');
SensorTag.discover(function(sensorTag) {

	sensorTag.on('disconnect', function() {
		console.log('Tag Disconnected');
		process.exit(0);
	});

	// run functions in series
	async.series([
			function(callback) { // read config file if any
				properties.parse(configFile, {
					path : true
				}, function(err, config) {
					if (err && err.code != 'ENOENT')
						throw err;
					if (config) {
						
						org = config.org || missing('org');
						type = config.type || missing('type');
						deviceId = config.id || missing('id');
						password = config['auth-token'] || missing('auth-token');
						var method = config['auth-method'] || missing('auth-method');
						if (method != 'token') {
							console.log("unexpected auth-method = " + method);
							process.exit(1);
						}
						username = 'use-token-auth';
						host = org + reg_domain;
						tls = true;
						qs_mode = false;
					}
					callback();
				});
			},
			function(callback) { // fill deviceId
				if (qs_mode && !deviceId) {
					getmac.getMac(function(err, macAddress) {
						if (err)
							throw err;
						console.log('MAC address = ' + macAddress);
						deviceId = macAddress.replace(/:/g, '').toLowerCase();
						callback();
					});
				} else
					callback();
			},
			function(callback) { // connect MQTT client
				var clientId = "d:" + org + ":" + type + ":" + deviceId;
				console.log('MQTT clientId = ' + clientId);
				if (qs_mode) {
					client = mqtt.createClient(u_port, host, {
						"clientId" : clientId,
						"keepalive" : 30
					});
				} else {
					if (tls) {
						console.log("TLS connect host: " + host + " port " + s_port);
						client = mqtt.createSecureClient(s_port, host, {
							"clientId" : clientId,
							"keepalive" : 30,
							"username" : username,
							"password" : password
						});
					} else {
						console.log("Connect host: " + host + " port " + u_port);
						client = mqtt.createClient(u_port, host, {
							"clientId" : clientId,
							"keepalive" : 30,
							"username" : username,
							"password" : password
						});
					}
				}
				client.on('connect', function() {
					// not reliable since event may fire before handler
					// installed
					console.log('MQTT Connected');
				});
				client.on('error', function(err) {
					console.log('client error' + err);
					process.exit(1);
				});
				client.on('close', function() {
					console.log('client closed');
					process.exit(1);
				});
				callback();
			},
			function(callback) {
				ledBlink(0, 0); // turn off
				if (!qs_mode) {
					client.subscribe(sub_topic, { qos: 0 }, function(err, granted) { 
						if (err) throw err;
						console.log('Subscribed to ' + sub_topic);
						callback();
					});
					client.on('message', doCommand);
				} else {
					callback();
				}
			},
			function(callback) {
				console.log('sensortag connect');
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
				setInterval(function(tag) {
					tag.publish();
				}, 1000, tagData);
			},
			function(callback) {
				sensorTag.on('irTemperatureChange', function(objectTemperature,
						ambientTemperature) {
					tagData.d.objectTemp = parseFloat(objectTemperature.toFixed(1));
					tagData.d.ambientTemp = parseFloat(ambientTemperature.toFixed(1));
				});

				sensorTag.notifyIrTemperature(function() {

				});

				callback();
			}, function(callback) {
				sensorTag.on('accelerometerChange', function(x, y, z) {
					tagData.d.accelX = parseFloat(x.toFixed(1));
					tagData.d.accelY = parseFloat(y.toFixed(1));
					tagData.d.accelZ = parseFloat(z.toFixed(1));
				});

				sensorTag.notifyAccelerometer(function() {

				});

				callback();
			}, function(callback) {
				sensorTag.on('humidityChange', function(temperature, humidity) {
					tagData.d.humidity = parseFloat(humidity.toFixed(1));
					tagData.d.temp = parseFloat(temperature.toFixed(1));
				});

				sensorTag.notifyHumidity(function() {

				});

				callback();
			}, function(callback) {
				sensorTag.on('magnetometerChange', function(x, y, z) {
					tagData.d.magX = parseFloat(x.toFixed(1));
					tagData.d.magY = parseFloat(y.toFixed(1));
					tagData.d.magZ = parseFloat(z.toFixed(1));
				});

				sensorTag.notifyMagnetometer(function() {

				});

				callback();
			}, function(callback) {
				sensorTag.on('barometricPressureChange', function(pressure) {
					tagData.d.pressure = parseFloat(pressure.toFixed(1));
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
			}, function(callback) {
				console.log('disconnect');
				sensorTag.disconnect(callback);
			} ]);
});
