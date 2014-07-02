iot-beaglebone
==============
This repository contains working sample device client software for the IBM Internet of Things Cloud Quickstart service
running on the TI BeagleBone.

BeagleBone
==========
Use a BeagleBone Black to connect a TI SensorTag to the IBM Internet of Things Cloud QuickStart service. Then you can visualize the data transmitted by the SensorTag's temperature, humidity, pressure, accelerometer, gyroscope and magnetometer sensors.

See this [recipe](https://www.ibmdw.net/iot/recipes/ti-beaglebone-sensortag/) for running the code in this repository.


Content
=======
There is one samples:
* nodejs, a command line forground sample in node.js that connects the SensorTag to the IBM IoT Cloud Quickstart service. This sample will exit if the sensor or the MQTT connection drops

