
//Require statements and server creation
var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);
app.listen(8000);


/*/configure express server
app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});*/

app.configure('development', function(){
    app.use(express.static(__dirname));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


//Object of users currently connected
var users = {

    drawer: false,
    
    viewers: 0
};

//Path Routing
app.get('/', function (req, res) {    
    res.sendfile(__dirname + '/pageRoute.html');
});
app.get('/canvas.html', function (req, res) {    
    res.sendfile(__dirname + '/canvas.html');
});    

app.get('/viewer.html', function (req, res) {      
    res.sendfile(__dirname + '/viewer.html');    
}); 


//Socket IO functions
io.sockets.on('connection', function(socket){

    socket.emit('user_connect', users.drawer);

//Saves socket as the drawer
    socket.on('new_drawer', function(){
        users.drawer = true; //users.drawer is set to true, which makes the router take client to /viewer.html
        socket.set('task', 'drawer');
        console.log('There is a new drawer');
    });
//Saves the socket as a viewer    
    socket.on('set_viewer', function(){
       users.viewers++;
       socket.set('task', 'viewer');
       console.log('New Viewer'); 
    });

//Communitcation of canvas draw data from draw page to view page    
	socket.on('Down', function(data){
		socket.broadcast.emit('mouseDown', data);
	});

	socket.on('Move', function(data){
		socket.broadcast.emit('mouseMove', data);
	});

//Actions on Disconnect from server	
	socket.on('disconnect', function(){
	    socket.get('task', function(err, task){
	        if (err){
	            console.log('Error deciding users task');
	        }
	        else if (task == 'drawer'){
	            users.drawer = false; //When drawer disconnects users.drawer is reset to false to allow a new drawer. Even though the value changes, the routing doesn't reset.
	            console.log('Drawer Disconnected');
	        }
	        else if (task == 'viewer'){
	            users.viewers--;
	            console.log('Viewer Disconnected');
	        }
	    });
	    
	});  
	
});

