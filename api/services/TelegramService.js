var TelegramBot = require('node-telegram-bot-api');
var token = '<<aqui va tu token de telegram bot>>';
var bot = new TelegramBot(token, {polling: true});

var serialPortFactory = require('serialport');
serialPortFactory.on("error",function(error){
    console.error("Error en serial port:::: ", error);
});
var sp = null;
// initialize serialport using the /dev/cu.usbmodem1411 serial port
// remember to change this string if your arduino is using a different serial port
try {
					//sustituye tu puerto usb al de tu equipo
    sp = new serialPortFactory.SerialPort('/dev/ttyACM0', {
	   baudRate: 115200
    },function(error){
        console.log(error);
    });
}catch(e) {
    sp = null;
}

// Se ejecura cuando se envia desde telegram la palabra /encender
bot.onText(/\/encender/, function (msg, match) {
    var fromId = msg.from.id;
    var nombre = msg.from.first_name;
    if(sp == null){
        bot.sendMessage(fromId, nombre + " lo sentimos!!!. El foco no se logro prender, se perdio la comunicacion con la casa :( ");    
    }else{
        if(sp.isOpen()){
            sp.write("on" + '\r', function() {
                bot.sendMessage(fromId, nombre + ", el foco de su cuarto fue encendido...");		
            });
        }else{
            bot.sendMessage(fromId, nombre + " lo sentimos!!!. El foco no se logro prender, se perdio la comunicacion con la casa :( ");
        }
    }
    
});

// Se ejecura cuando se envia desde telegram la palabra /apagar
bot.onText(/\/apagar/, function (msg, match) {
    var fromId = msg.from.id;
    var nombre = msg.from.first_name;
    if(sp == null){
        bot.sendMessage(fromId, nombre + ", lo sentimos!!!. El foco no se logro apagar, se perdio la comunicacion con la casa :( ");    
    }else{
        if(sp.isOpen()){
            sp.write("off" + '\r', function() {
                bot.sendMessage(fromId, nombre + ", el foco de su cuarto fue apagado...");		
            });
        }else{
            bot.sendMessage(fromId, nombre + ", lo sentimos!!!. El foco no se logro apagar, se perdio la comunicacion con la casa :( ");
        }
    }
});


module.exports = {
    
};
