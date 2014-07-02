#!/bin/sh

checkInstall() {
if dpkg --status $1 >/dev/null 2>&1
then 
	echo package $1 installed
else
	echo installing package $1
	apt-get install $1 || { echo install $1 failed, please retry; exit 1; }
fi
}

checkInstall bluez
checkInstall libbluetooth-dev

# install required node_modules
echo installing required node_modules
npm install || echo npm install failed, please retry
