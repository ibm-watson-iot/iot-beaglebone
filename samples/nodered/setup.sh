#!/bin/sh

REDVERSION=0.7.1

checkInstall() {
if dpkg --status $1 >/dev/null 2>&1
then 
	echo package $1 installed
else
	echo installing package $1
	apt-get install $1 || { echo install $1 failed, please retry; exit 1; }
fi
}

checkInstall unzip
checkInstall bluez
checkInstall libbluetooth-dev

# DL node-red
rm -f $REDVERSION.zip
wget https://github.com/node-red/node-red/archive/$REDVERSION.zip || { echo wget failed, please retry; exit 1; }
unzip $REDVERSION.zip || exit 1

# service script
cp node-red /etc/init.d/ || exit 1

# flow
cp flows_beaglebone.json node-red-$REDVERSION/flows_beaglebone.json || exit 1

cd node-red-$REDVERSION
npm install sensortag getmac || exit 1
npm install --production || exit 1

# patch for reconnect / DELETE ME - when patch is pushed to git
patch -p0 < ../mqttlost2.patch || exit 1

# add iot nodes / DELETE ME - should pull from git
(cd nodes; unzip ../../iot-nodes.zip) || exit 1

# add contributed nodes including sensortag
(cd nodes; git clone https://github.com/node-red/node-red-nodes.git) || exit 1

# setup service
sed -i "s%RED_DIR%$PWD%g" /etc/init.d/node-red || exit 1
update-rc.d node-red defaults || exit 1 

#service node-red start 

