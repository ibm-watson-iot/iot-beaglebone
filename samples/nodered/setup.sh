#!/bin/sh

REDVERSION=0.7.1

apt-get install unzip 
wget https://github.com/node-red/node-red/archive/$REDVERSION.zip
unzip $REDVERSION.zip
cd node-red-$REDVERSION
npm install sensortag setmac
npm install --production

# add contributed nodes including sensortag
(cd nodes; git clone https://github.com/node-red/node-red-nodes.git)

# add getmac to global context
sed -i "s/functionGlobalContext: { }/functionGlobalContext: { getmac:require('getmac') }/g" settings.js

# add the standard flow and code file for reference
git clone flow / function 

# install runner
update.rc /etc/inid.d/node-red defaults 
service node-red start 


