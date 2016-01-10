/**
 * LedController
 *
 * @description :: Server-side logic for managing Leds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var SerialPort = require('serialport').SerialPort,
// Cambia el puerto al de tu maquina
sp = new SerialPort('/dev/ttyACM0', {
	baudRate: 115200
});

module.exports = {
	
	swLed:function(request, response){
		
		console.log("toggle controller sails");
		var data = request.allParams();
		console.log("Request: ", data);
		sp.write(data.operacion + '\r', function() {
			// log the light status into the terminal
			//console.log('the light should be: ' + data.operacion);
			return response.json(data);
		});
	}
	
};

