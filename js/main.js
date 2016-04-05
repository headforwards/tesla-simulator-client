/**
 * Visualisation Client for Tesla Simulator - this application connects
 * to the Tesla Simulator Server with a socket and then will receive
 * commands from the server that are used to visualise the "state"
 * of one or more Tesla cars controlled via the server API.
 */
var $ = require('jquery');
var Handlebars = require('handlebars');
var socket =  require('socket.io-client')('http://localhost:8000');

var carTemplate = Handlebars.compile($('#tesla-tmpl').html());

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
        var html = carTemplate({ vehicle_id: this._vehicle_id });

        this.$car = $(html);

        //this.$car.html('<ul class="messages"/>');
        this._renderMessage('created "' + this._vehicle_id + '" car');
    },

    _renderMessage: function(message) {
        $('.messages', this.$car).append(
            $('<li class="message">').text(message));
    },

    handleCommand: function(msg) {
        if("function" === typeof this[msg.command]) {
            this[msg.command](msg);
            return;
        }

        var messageStr = msg.command;
        for(var param in msg) {
            if(param !== 'command' && param !== 'vehicle_id') {
                messageStr += ': ' + param + ' = ' + msg[param];
            }
        }
        this._renderMessage(messageStr);
    },

    //Commands
    honk_horn: function() {
        $('#horn_sound')[0].play();
    },

    lights_on: function() {
        $('.headlight', this.$car).addClass('on');
    },

    lights_off: function() {
        $('.headlight', this.$car).removeClass('on');
    },

    wake_up: function() {
        var delay = 150,
            self = this;

        self._flashLights(delay);
        setTimeout(function() {
            self._flashLights(delay);
        }, delay * 2);


        for(var i = 1; i < 7; i++) {
            self._fadeInPanel(i, i);
        }
        for(var j = 13; j > 6; j--) {
            self._fadeInPanel(j);
        }
    },

    _flashLights: function(delay) {
        var headlights = $('.headlight', this.$car),
            lightsOn = headlights.hasClass('on');

        function revertHeadlights(next){
            if(!lightsOn) {
                headlights.removeClass('on')
            }
            headlights.removeClass('indicator');
            next();
        }
        if(!lightsOn) {
            headlights.addClass('on')
        }
        headlights.addClass('indicator')
            .delay(delay).queue(revertHeadlights);
    },

    _fadeInPanel: function(index, delay) {
        var fadeDelay = 400;
        $('.panel-' + index, this.$car).delay(fadeDelay*(index+1))
            .queue(function(next){
                $(this).fadeIn(fadeDelay);
                next();
            });
    },

    start_charging: function() {
        $('.js-battery-charge', this.$car).html('Charging');
    },

    stop_charging: function() {
        $('.js-battery-charge', this.$car).html('Not charging');
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
