#!/bin/sh

REDVERSION=0.7.1

# ensure zip is available
apt-get install unzip 

# DL node-red
wget https://github.com/node-red/node-red/archive/$REDVERSION.zip
unzip $REDVERSION.zip

# service script
cp node-red /etc/init.d
sed -i "s/RED_DIR/$MYDIR/g" /etc/init.d/node-red

# flow
cp flows_beaglebone.json node-red-$REDVERSION

# patch for reconnect / DELETE ME - when patch is pushed to git
patch < mqttlost2.patch 

cd node-red-$REDVERSION
npm install sensortag getmac
npm install --production

# add iot nodes / DELETE ME - should pull from git
(cd nodes; unzip ../../iot-nodes.zip)

# add contributed nodes including sensortag
(cd nodes; git clone https://github.com/node-red/node-red-nodes.git)

# setup service
update.rc /etc/inid.d/node-red defaults 
service node-red start 


