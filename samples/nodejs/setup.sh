#!/bin/sh

dpkg --status libbluetooth-dev > /dev/null 2>&1
if [ "$?" = "1" ]; then
	echo "Please install bluetooth development libraries, run:\n\tsudo apt-get install libbluetooth-dev"
	exit 1
fi
	
# install pre-requisites
npm install async getmac mqtt sensortag


