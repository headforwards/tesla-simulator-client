/**
 * Created by Rich on 30-Jan-16.
 */
var socket = io();

socket.on('message', function(msg){
    var myCar = $('#myCar').val();

    if (msg.car === myCar || myCar === 'All') {
        // FIXME inline styles, just for demo!
        $('#messages').append($('<li style="color:' + msg.car + '">').text(msg.action));
    }
});

function emitMessage(message) {
    var msg = {
        car: $('#selCar').val(),
        action: message
    };
    socket.emit('message', msg);
}