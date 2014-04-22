Node-RED Sample
===============


First obtain and prepare the ingredients in the top level README.md.
You should now be ready to download and run the sample software and connect.

Connect
=======
Log in to Debian as root (by default, no password is required).
Clone the GitHub project: git clone https://github.com/ibm_messaging/iot-beaglebone

cd samples/nodered
run ./setup.sh. This completes the following tasks:
Installs node-red, contributed nodes, npm requisites, and configures a system service to run a supplied flow.
This will take a few minutes. When it successfully completes the flow should be running.

To start the flow of messages press the button on the side of the SensorTag which will initiate the discovery of the tag by the beagelBone.

Find out what your MAC address is, this can be found in the node-red service log file (node.out). 
 

Sample Development
==================
You can connect a browser to port 1880 in order to see the flow in the Node-RED UI modify and use debug nodes to show events emitted.
In case you need to rebiild the flow the code for the tagData merge function can be found in the file function-tagData-merge.js
