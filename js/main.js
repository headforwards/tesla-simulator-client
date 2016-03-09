/**
 * Created by Rich on 30-Jan-16.
 */
var socket = io();

socket.on('message', function(msg){

    if (msg.action.indexOf('flash_lights') > -1) {
        flashHeadlights();
    } else  if (msg.action.indexOf('wake_up_car') > -1) {
        wakeUpCar();
    } else  if (msg.action.indexOf('start_charging') > -1) {
        chargeStatus('Charging');
    } else  if (msg.action.indexOf('stop_charging') > -1) {
        chargeStatus('Not Charging');
    }
/*
    var myCar = $('#myCar').val();
    if (msg.car === myCar || myCar === 'All') {
        // FIXME inline styles, just for demo!
        $('#messages').append($('<li style="color:' + msg.car + '">').text(msg.action));
    }*/
});

function chargeStatus(state) {
    var batteryCharge = $('.js-battery-charge');

    batteryCharge.html(state);
}

function getChargeState() {
    var chargeStateResponse = {
        "response": {
        "charging_state": "Complete",  // "Charging", ??
            "charge_to_max_range": false,  // current std/max-range setting
            "max_range_charge_counter": 0,
            "fast_charger_present": false, // connected to Supercharger?
            "battery_range": 239.02,       // rated miles
            "est_battery_range": 155.79,   // range estimated from recent driving
            "ideal_battery_range": 275.09, // ideal miles
            "battery_level": 91,           // integer charge percentage
            "battery_current": -0.6,       // current flowing into battery
            "charge_starting_range": null,
            "charge_starting_soc": null,
            "charger_voltage": 0,          // only has value while charging
            "charger_pilot_current": 40,   // max current allowed by charger & adapter
            "charger_actual_current": 0,   // current actually being drawn
            "charger_power": 0,            // kW (rounded down) of charger
            "time_to_full_charge": null,   // valid only while charging
            "charge_rate": -1.0,           // float mi/hr charging or -1 if not charging
            "charge_port_door_open": true
        }
    };
}

function flashHeadlights() {
    commandHeadlights('on', 250);
}

function wakeUpCar() {
    var delay = 150;
    commandHeadlights('on indicator', delay);
    setTimeout(function() {
        commandHeadlights('on indicator', delay);
    }, delay * 2);


    for(var i = 1; i < 7; i++) {
        fadeInPanel(i, i);
    }
    for(var j = 13; j > 6; j--) {
        fadeInPanel(j);
    }
}

function fadeInPanel(index, delay) {
    var fadeDelay = 400;
    $('.panel-' + index).delay(fadeDelay*(index+1)).queue(function(next){
        $(this).fadeIn(fadeDelay);
        next();
    });
}

function commandHeadlights(classes, delay) {
    var headlights = $('.headlight');

    headlights.addClass(classes).delay(delay).queue(function(next){
        $(this).removeClass("on indicator");
        next();
    });
}

function emitMessage(message) {
    var msg = {
        car: $('#selCar').val(),
        action: message
    };
    socket.emit('message', msg);
}