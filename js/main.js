/**
 * Created by Rich on 30-Jan-16.
 */
var socket = io('http://localhost:8000');

socket.on('message', function(msg){
    if(msg.error) {
        console.log('error ', msg)

    } else if(msg.command) {
        handleCommand(msg);
    } else {
        handleVehicleIds(msg);
    }
});

socket.on('json', function(msg){
    console.log('json ', msg)
    if(msg.command) {
        handleCommand(msg);
    }
});

function handleVehicleIds(msg) {
    // <option value="red">Red Car</option>
    //
    if(!msg || !msg.length) {
        console.log('handleVehicleIds no ids!');
    }

    var sourceCar = document.querySelector('#selCar'),
        targetCar = document.querySelector('#myCar');

    msg.forEach(function(id) {
        var option = document.createElement('option');

        option.value = id;
        option.appendChild(document.createTextNode(id + ' car'));

        sourceCar.appendChild(option);

        targetCar.appendChild(option.cloneNode(true));
    })
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

socket.on('connect', function() {
    socket.emit('json', { command: 'list_vehicle_ids'} );
});
