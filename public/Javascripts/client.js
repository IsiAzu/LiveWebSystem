/**
 * Created by Isi on 11/5/14.
 */
var socket = io.connect('/');

socket.on('connect', function (data){
    console.log('Connected');
});

socket.on('audio', function(data){
    console.log("Got audio" + data.left.length);
    var leftBuffer = new Float32Array(data.left);
    var audioContext = new AudioContext();
    var audioSource = audioContext.createBuffer(1, leftBuffer.length, audioContext.sampleRate);
    newBuffer.getChannelData(0).set(leftBuffer);

    audioSource.buffer = newBuffer;

    audioSource.connect( audioContext.destination );
    audioSource.start(0);
});


function init(){
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true}, function(stream) {

                var audioContext = new AudioContext();
                var audioSource = audioContext.createMediaStreamSource(stream);


                //recorder
                var recorder;
                recorder = new Recorder(audioSource); // Once we have the stream...

                startRec = function(button) {
                    recorder.record();
                    button.disabled = true;
                    button.nextElementSibling.disabled = false;
                    console.log('Recording...');
                };

                stopRec = function(button) {
                    recorder.stop();
                    button.disabled = true;
                    button.previousElementSibling.disabled = false;
                    console.log('Stopped recording.');

                    recorder.getBuffer(function(buffers) {
                        // Binary data - ArrayBuffer
                        var bufferToSend = buffers[0].buffer;
                        var dataToSend = {left: bufferToSend};
                        socket.emit('audio',dataToSend);
                    });
                    createPlayer();

                };//end of stopRecording

                createPlayer = function(){

                    recorder.exportWAV(function (blob) {
                        var li = document.createElement('li');
                        var au = document.createElement('audio');

                        au.controls = true;
                        li.appendChild(au);
                        recordingslist.appendChild(li);


                    })
                }

            }, function(error) {alert("Failure " + error.code);}
        );
    }//end of get user media
}//end of init

window.addEventListener('load', init);