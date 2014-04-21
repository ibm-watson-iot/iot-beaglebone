// IoT Cloud QuickStart Driver
// node.js running on BeagleBone Black with BLE adaptor and Texas Instruments SenstorTag CC2451


var util = require('util');
var async = require('async');
var SensorTag = require('sensortag');

var mqtt = require('mqtt');
var host = "messaging.quickstart.internetofthings.ibmcloud.com"; // production http://quickstart.internetofthings.ibmcloud.com
var port = "1883";
var client;
var deviceId;
var topic;


var tagData = {};
tagData.d = {};

tagData.print = function () {
  console.log('\tobject temperature = %d °C  ambient temperature = %d °C', this.objectTemp, this.ambientTemp);
  console.log('\taccelerometer x = %d G  y = %d G  z = %d G', this.accelerometer.x, this.accelerometer.y, this.accelerometer.z);
  console.log('\thumidity = %d %  temperature = %d °C', this.humidity, this.temperature);
  console.log('\tmagnetometer x = %d μT  y = %d μT  z = %d μT', this.magnetometer.x, this.magnetometer.y, this.magnetometer.z);
  console.log('\tpressure = %d mBar', this.pressure);
  console.log('\tgyroscope x = %d °/s  y = %d °/s  z = %d °/s', this.gyroscope.x, this.gyroscope.y, this.gyroscope.z);
};

tagData.toJson = function () {
  return JSON.stringify(this);
};

tagData.publish = function () {
  if (tagData.d.hasOwnProperty("temp")) {
	client.publish(topic, tagData.toJson());
	//console.log(topic, tagData.toJson());
  }
};

require('getmac').getMac(function(err, macAddress) {
  if (err) throw err;
  deviceId = macAddress.replace(/:/g, '');
  client = mqtt.createClient(port, host, { "clientId": "quickstart:"+deviceId } );
  topic = "iot-1/d/" + deviceId + "/evt/titag-quickstart_/json"; // Not right MessageType Defect in UI
});

console.log('Press side button on SensorTag to connect');
SensorTag.discover(function(sensorTag) {

  sensorTag.on('disconnect', function() {
    console.log('disconnected!');
    process.exit(0);
  });

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
	      tagData.d.objectTemp =  objectTemperature.toFixed(1);
              tagData.d.ambientTemp =  ambientTemperature.toFixed(1);
        });

        sensorTag.notifyIrTemperature(function() {

        });

        callback();
      },
      function(callback) {
        sensorTag.on('accelerometerChange', function(x, y, z) {
	      tagData.d.accelX = x.toFixed(1);
	      tagData.d.accelY = y.toFixed(1);
	      tagData.d.accelZ = z.toFixed(1);
        });

        sensorTag.notifyAccelerometer(function() {

        });

        callback ();
      },
      function(callback) {
        sensorTag.on('humidityChange', function(temperature, humidity) {
	      tagData.d.humidity =  humidity.toFixed(1);
          tagData.d.temp = temperature.toFixed(1);
        });

        sensorTag.notifyHumidity(function() {

        });

        callback();
      },
      function(callback) {
        sensorTag.on('magnetometerChange', function(x, y, z) {
	      tagData.d.magX = x.toFixed(1);
	      tagData.d.magY = y.toFixed(1);
	      tagData.d.magZ = z.toFixed(1);
        });

        sensorTag.notifyMagnetometer(function() {

        });

        callback();
      },
      function(callback) {
        sensorTag.on('barometricPressureChange', function(pressure) {
	  		tagData.d.pressure =  pressure.toFixed(1);
        });

        sensorTag.notifyBarometricPressure(function() {

        });

        callback();
      },
      
      function(callback) {
        sensorTag.on('gyroscopeChange', function(x, y, z) {
	  	  tagData.d.gyroX = x.toFixed(1);
	      tagData.d.gyroY = y.toFixed(1);
	      tagData.d.gyroZ = z.toFixed(1);
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


