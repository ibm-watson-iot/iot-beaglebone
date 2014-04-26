Node-RED sample
===============

Prepare the BeagleBone Black 
----------------------------

There are a few tasks to complete to prepare your BeagleBone for connection to the IBM Internet of Things Cloud Quickstart service.

1. Get Debian Linux for your BeagleBone.
   This operating system will be supplied with Rev C BBBs.
   You can install Debian Linux on a Micro SD card and boot the BeagleBone from there.
   For downloading Debian Linux and booting from a Micro SD card, see http://beagleboard.org/latest-images.
2. With Debian Linux running, connect your BeagleBone to a Windows or Linux or Mac computer, using the supplied USB cable.
   If you are using a Windows or Mac, you need to install some drivers to access your BeagleBone, see http://beagleboard.org/Getting%20Started.
3. Run SSH on your computer and login as root to the BeagleBone at 192.168.7.2 using the USB point to point network link.
4. Insert the USB BLE adaptor into the USB socket.
5. You also need the BeagleBone to have internet access. This can be gatewayed over the USB link or provided separately through the BeagleBone Ethernet port.

Now you are ready to install the sample and connect to the IBM Internet of Things Cloud Quickstart service.

Connect
-------

1. Log in to Debian as root (by default, no password is required).
2. Clone the GitHub project: __git clone https://github.com/ibm-messaging/iot-beaglebone__
3. __cd iot-beaglebone/samples/nodered__
4. Run __./setup.sh__. This completes the following tasks:
   Installs node-red, contributed nodes, npm requisites, and configures a system service to run a supplied flow.
   This will take a few minutes.
5. Find your MAC address for example using __ifconfig eth0__ which is needed for the [quickstart site](http://quickstart.internetofthings.ibmcloud.com).
6. Start node-red with __service node-red start__


Diagnostics and Development
---------------------------
Check the node-red.out file for diagnostics from node-red.
To confirm that the SensorTag can be detected use *hcitool lescan*, you will have to press the side button on the SensorTag, and when the tag id is displayed press ctrl-C.
You can connect a browser to port [beaglebone-address:1880]  in order to see the flow in the Node-RED UI modify and use debug nodes to show events emitted.
In case you need to rebiild the flow the code for the tagData merge function can be found in the file function-tagData-merge.js
