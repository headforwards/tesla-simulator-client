var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

function handleMessage(msg) {

    var response = {};

    var command = msg.command;

    switch(command) {
        case 'list_vehicle_ids':
            response = ['red', 'green', 'blue'];
            break;
        default:
            response = {
                command: command,
                vehicle_id: msg.vehicle_id
            }
    }

    io.emit('message', response);
}

io.on('connection', function(socket){
  socket.on('message', handleMessage);
});



http.listen(3000, function(){
  console.log('listening on *:3000');
});
