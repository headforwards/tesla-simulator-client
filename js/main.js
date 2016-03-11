/**
 * Visualisation Client for Tesla Simulator - this application connects
 * to the Tesla Simulator Server with a socket and then will receive
 * commands from the server that are used to visualise the "state"
 * of one or more Tesla cars controlled via the server API.
 */
var $ = require('jquery');
var socket =  require('socket.io-client')('http://localhost:8000');

/* Very simplistic "car" object which draws itself and handles messages / commands
*/
var carProto = {
    _vehicle_id: null,
    $car: null,
    init: function($container, vehicle_id) {
        this._vehicle_id = vehicle_id;
        this._render()
        $container.append(this.$car);
    },

    _render: function() {
        this.$car = $('<div class="car" id="' + this._vehicle_id + '"/>');

        this.$car.html('<ul class="messages"/>');
        this._renderMessage('created "' + this._vehicle_id + '" car');
    },

    _renderMessage: function(message) {
        $('.messages', this.$car).append(
            $('<li class="message">').text(message));
    },

    handleCommand: function(msg) {
        var messageStr = msg.command;
        for(var param in msg) {
            if(param !== 'command' && param !== 'vehicle_id') {
                messageStr += ': ' + param + ' = ' + msg[param];
            }
        }
        this._renderMessage(messageStr);
    }
};

var cars = {};

function handleVehicleIds(msg) {
    try {
        if(msg.error) {
            console.log('error ', msg);
            return;
        }
        var $container = $('#car-container');
        $container.html();

        msg.response.vehicle_ids.forEach(function(id) {
            var car = Object.create(carProto);
            cars[id] = car;
            car.init($container, id);
        });

    } catch(e) {
        //If there are no vehicles for an email - this happens - play nicer!
        console.error('handleVehicleIds message error ', msg, e);
    }
}

function handleCommand(msg) {
    try {
        var car = cars[msg.vehicle_id];
        car.handleCommand(msg);
    } catch(e) {
        console.error('handleCommand message error ', msg, e);
    }
}

function parseSearch() {
    var search = {};
    document.location.search.replace('?', '')
        .split('&')
        .forEach(function(param) {
            var arr = param.split('='), obj = {};
            search[arr[0]] = arr[1];
        });
    return search;
}

/******************************************************************************
 *  Socket IO related functionality
 ******************************************************************************/
socket.on('json', function(msg){
    if(msg.error) {
        console.log('error ', msg);
    } else if(!msg.command) {
        console.log('error - no command', msg)
    } else {
        handleCommand(msg);
    }
});

socket.on('list_vehicle_ids', handleVehicleIds);

socket.on('connect', function() {
    console.log('connected!')
    var params = null;
    search = parseSearch();
    if(search.email) {
        params = { email: search.email };
    }
    socket.emit('list_vehicle_ids', params);
});
