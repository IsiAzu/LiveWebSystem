/**
 * Created by Isi on 11/5/14.
 */
var socket = io.connect();

socket.on('connect', function (data){
    console.log('Connected');
});

//var m = document.getElementById('messages').innerHTML;

var sen = function(input){
    sendMessage(document.getElementById('m').value);
};

socket.on('chat message', function(data){
    document.getElementById('messages').innerHTML = " " + data + " <br> " +
    document.getElementById('messages').innerHTML;
});

var sendMessage = function (message) {
    console.log("chat message: " + message);
    socket.emit('chat message', message);
};