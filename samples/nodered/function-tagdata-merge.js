
if (!context.hasOwnProperty("tagData")) {
context.tagData = {};
context.tagData.d = {};
}

if (!context.hasOwnProperty("topic")) {
	context.global.getmac.getMac(function(err, mac) {
		if (err) throw err;
		var deviceId = mac.replace(/:/g, '');
  		context.topic = "iot-1/d/" + deviceId + "/evt/titag-quickstart/json";
  		} );
}

var tagData = context.tagData;

switch (msg.topic) {
    case "trigger":
 		// only send full tagData
 		if (tagData.d.pressure &&
 			tagData.d.humidity &&
 			tagData.d.gyroX &&
 			tagData.d.magX &&
 			tagData.d.accelX &&
 			tagData.d.ambientTemp) {
    	 return { topic: context.topic, payload: tagData };
    	}
    	break;
    	
	case "sensorTag/pressure":
		tagData.d.pressure = msg.payload.pres;
		break;
	
	case "sensorTag/humidity":
		tagData.d.humidity = msg.payload.humidity;
		tagData.d.temp = msg.payload.temp;
		break;
		
	case "sensorTag/gyroscope":
		tagData.d.gyroX = msg.payload.x;
		tagData.d.gyroY = msg.payload.y;
		tagData.d.gyroZ = msg.payload.z;
		break;
		
	case "sensorTag/magnetometer":
		tagData.d.magX = msg.payload.x;
		tagData.d.magY = msg.payload.y;
		tagData.d.magZ = msg.payload.z;
		break;	
		
	case "sensorTag/accelerometer":
		tagData.d.accelX = msg.payload.x;
		tagData.d.accelY = msg.payload.y;
		tagData.d.accelZ = msg.payload.z;
		break;	
	
	case "sensorTag/temperature":
		tagData.d.ambientTemp = msg.payload.ambient;
		tagData.d.objectTemp = msg.payload.object;
		break;
		
	case "sensorTag/keys":
		// not sending keys
		break;
		
	default:
		console.log("unexpected topic: " , msg.topic);
		break;
}

return null;
if (!context.hasOwnProperty("tagData")) {
context.tagData = {};
context.tagData.d = {};
}

if (!context.hasOwnProperty("topic")) {
	context.global.getmac.getMac(function(err, mac) {
		if (err) throw err;
		var deviceId = mac.replace(/:/g, '');
  		context.topic = "iot-1/d/" + deviceId + "/evt/titag-quickstart/json";
  		} );
}

var tagData = context.tagData;

switch (msg.topic) {
    case "trigger":
 		// only send full tagData
 		if (tagData.d.pressure &&
 			tagData.d.humidity &&
 			tagData.d.gyroX &&
 			tagData.d.magX &&
 			tagData.d.accelX &&
 			tagData.d.ambientTemp) {
    	 return { topic: context.topic, payload: tagData };
    	}
    	break;
    	
	case "sensorTag/pressure":
		tagData.d.pressure = msg.payload.pres;
		break;
	
	case "sensorTag/humidity":
		tagData.d.humidity = msg.payload.humidity;
		tagData.d.temp = msg.payload.temp;
		break;
		
	case "sensorTag/gyroscope":
		tagData.d.gyroX = msg.payload.x;
		tagData.d.gyroY = msg.payload.y;
		tagData.d.gyroZ = msg.payload.z;
		break;
		
	case "sensorTag/magnetometer":
		tagData.d.magX = msg.payload.x;
		tagData.d.magY = msg.payload.y;
		tagData.d.magZ = msg.payload.z;
		break;	
		
	case "sensorTag/accelerometer":
		tagData.d.accelX = msg.payload.x;
		tagData.d.accelY = msg.payload.y;
		tagData.d.accelZ = msg.payload.z;
		break;	
	
	case "sensorTag/temperature":
		tagData.d.ambientTemp = msg.payload.ambient;
		tagData.d.objectTemp = msg.payload.object;
		break;
		
	case "sensorTag/keys":
		// not sending keys
		break;
		
	default:
		console.log("unexpected topic: " , msg.topic);
		break;
}

return null;
