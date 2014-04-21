#!/bin/sh

REDVERSION=0.7.1

apt-get install unzip 
wget https://github.com/node-red/node-red/archive/$REDVERSION.zip
unzip $REDVERSION.zip

cp node-red /etc/init.d
sed -i "s/RED_DIR/$MYDIR/g" /etc/init.d/node-red

cp flows_beaglebone.json node-red-$REDVERSION

cd node-red-$REDVERSION
npm install sensortag getmac
npm install --production

# add contributed nodes including sensortag
(cd nodes; git clone https://github.com/node-red/node-red-nodes.git)

# add getmac to global context
sed -i "s/functionGlobalContext: { }/functionGlobalContext: { getmac:require('getmac') }/g" settings.js

# setup runner
update.rc /etc/inid.d/node-red defaults 
service node-red start 


