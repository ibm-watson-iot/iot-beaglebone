iot-beaglebone
==============
This repository contains working sample device client software for the IBM Internet of Things Cloud Quickstart service
on the TI BeagleBone.

BeagleBone
==========
Use a BeagleBone Black to connect a TI SensorTag to the IBM Internet of Things Cloud QuickStart service. Then you can visualize the data transmitted by the SensorTag's temperature, humidity, pressure, accelerometer, gyroscope and magnetometer sensors.

See this [recipe](https://www.ibmdw.net/iot/recipes/ti-beaglebone-sensortag/) for running the code in this repository.


Content
=======
There are two samples:
* nodejs, a command line forground sample in node.js that connects the SensorTag to the IBM IoT Cloud Quickstart service. This sample will exit if the sensor or the MQTT connection drops

* nodered, this sample installs Node-RED (see nodered.org) as an "always on" service. Node-RED provides a capability to develop an application using a browser based UI. The sample recipe installs nodes for SensorTag and IBM Internet of Things Cloud Quickstart service, together with a sample flow that sends all the SensorTag values up to the Quickstart on a 1s interval.
