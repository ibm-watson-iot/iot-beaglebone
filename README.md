iot-beaglebone
==============
This repository contains working samples device client software for the IBM Internet of Things Cloud (QuickStart)
on the TI BeagleBone.

BeagleBone
==========
Use a BeagleBone Black to connect a TI SensorTag to the IoT cloud. Then you can visualize the data transmitted by the SensorTag's temperature, humidity, pressure, accelerometer, gyroscope and magnetometer sensors.

See this [recipe](https://www.ibmdw.net/iot/recipes/ti-beaglebone-sensortag/) for running the code here.


Content
=======
There are two samples:
* nodejs, a command line forground sample in node.js which connects the SensorTag to the IBM IoT Cloud QuickStart service, this sample will exit if the sensor or the mqtt connection drops

* nodered, this sample installs Node-RED (see nodered.org) as an "always on" service, Node-RED provides a capability to develop browser based UI, the sample installs nodes for SensorTag and IBM Internet of Things Quickstart, together with a sample flow, which sends all the Sensrtag values up to the cloud on a 1s interval.
