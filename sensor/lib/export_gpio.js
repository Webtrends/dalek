var Gpio = require('onoff').Gpio,
    sensor = new Gpio(17, 'in', 'both'),
    sensor2 = new Gpio(27, 'in', 'both'),
    sensor3 = new Gpio(22, 'in', 'both');


