/**
 * Created by Rich on 30-Jan-16.
 */


/* Very simplistic "car" object which draws itself and handles messages / commands
*/
var carProto = {
    _vehicle_id: null,
    $car: null,
    init: function($container, vehicle_id) {
        this._vehicle_id = vehicle_id;
        //Render itself
        this._render()
        $container.append(this.$car);
    },

    _render: function() {
        this.$car = $('<div class="car" id="' + this._vehicle_id + '"/>');

        this.$car.html('<ul class="messages"/>');
    },

    _renderMessage: function(message) {
        $('messages', this.$car).append(
            $('<li class="message">').text(message));
    },

    handleCommand: function(msg) {
        this._renderMessage(msg.command);
    }
};

var socket = io('http://localhost:8000');

socket.on('json', function(msg){
    console.log('json ', msg)
    if(msg.error) {
        console.log('error ', msg)

    } else if(!msg.command) {
        console.log('error - no command', msg)
    } else if(msg.command === 'list_vehicle_ids') {
        handleVehicleIds(msg);
    } else {
        ///
    }
});

var cars = {};

function handleVehicleIds(msg) {
    try {
        var $container = $('#car-container');
        $container.html();

        msg.response.vehicle_ids.forEach(function(id) {
            var car = Object.create(carProto);
            cars[id] = car;
            car.init($container, id);
        });


    } catch(e) {
        console.error('handleVehicleIds message error ', msg, e);
    }
}

function handleCommand(msg) {
    var myCar = $('#myCar').val();


    if (msg.vehicle_id === myCar || myCar === 'All') {
        // FIXME inline styles, just for demo!
        $('#messages').append($('<li style="color:' + msg.vehicle_id + '">').text(msg.command));
    }
}

function emitMessage(message) {
    var msg = {
        vehicle_id: $('#selCar').val(),
        command: message
    };
    socket.emit('json', msg);
}

function parseSearch() {
    var search = {};
    document.location.search.replace('?', '')
        .split('&')
        .forEach(function(search) {
            var arr = search.split('='), obj = {};
            search[arr[0]] = arr[1];
        });
    return search;
}

socket.on('connect', function() {
    console.log('connected!')
    var command = { command: 'list_vehicle_ids' };
    search = parseSearch();
    if(search.email) {
        command.email = search.email;
    }

    socket.emit('json', command);
});
