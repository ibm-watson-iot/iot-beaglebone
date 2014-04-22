Node-RED Sample
===============


First obtain and prepare the ingredients in the top level README.md.
You should now be ready to download and run the sample software and connect.

Connect
=======
Log in to Debian as root (by default, no password is required).
Clone the GitHub project: git clone https://github.com/ibm_messaging/iot-beaglebone

cd samples/nodejs
Run setup.sh. This completes the following tasks:
Installs required node packages – async, sensortag, MQTT – using npm.
Now run the sample with: node ibm_iot_sensortag_quickstart.js

This sample runs in the foreground and will need to be restarted if the connection is lost of the SensorTag disconnects.
Press the button on the side of the SensorTag so that it starts sending sense data to IoT Cloud.
The sample will display the MAC address on the console.

