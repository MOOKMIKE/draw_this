var socket = io.connect("http://localhost:8000");
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

 socket.on('user_connect', function(){
  socket.emit('set_viewer');  
});  

socket.on('mouseDown', function(data){
	context.beginPath();
	context.moveTo(data.x, data.y);
});

socket.on('mouseMove', function(data){
	context.lineTo(data.x, data.y);
	context.stroke();	
});
