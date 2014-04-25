node.js sample
==============

Prepare the BeagleBone Black 
----------------------------

There are a few tasks to complete to prepare your BeagleBone for connection to the IoT Cloud.

1. Get Debian Linux for your BeagleBone.
   This operating system will be supplied with Rev C BBBs.
   You can install Debian Linux on a Micro SD card and boot the BeagleBone from there.
   For downloading Debian Linux and booting from a Micro SD card, see http://beagleboard.org/latest-images.
2. With Debian Linux running, connect your BeagleBone to a Windows or Linux or Mac computer, using the supplied USB cable.
   If you are using a Windows or Mac, you need to install some drivers to access your BeagleBone, see http://beagleboard.org/Getting%20Started.
3. Run SSH on your computer and login as root to the BeagleBone at 192.168.7.2 using the USB point to point network link.
4. Insert the USB BLE addaptor into the USB socket and confirm that the SensorTag can be detected using *hcitool lescan*, you will have to press the side button on the SensorTag.
5. You also need the BeagleBone to have internet access, this can be gatewayed over the USB link or provided separately through the BeagleBone Ethernet port.

Now you are ready to install the sample and connect to the IBM Internet of Things Cloud Quickstart service.

Connect
-------

1. Log in to Debian as root (by default, no password is required).
2. Clone the GitHub project: __git clone https://github.com/ibm-messaging/iot-beaglebone__
3. __cd iot-beaglebone/samples/nodejs__
4. Run __./setup.sh__. This completes the following tasks:
   Installs required node packages – async, sensortag, MQTT – using npm.
5. Now run the sample with: node ibm_iot_sensortag_quickstart.js

This sample runs in the foreground and will need to be restarted if the connection is lost or the SensorTag disconnects.
Press the button on the side of the SensorTag so that it starts sending sensor data to the IBM Internet of Things Cloud Quickstart service.
The sample will display the MAC address on the console. Enter the MAC address at the [quickstart site](http://quickstart.internetofthings.ibmcloud.com) to see a visualisation of the sensor data.

