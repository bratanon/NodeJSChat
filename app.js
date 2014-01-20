// Requires
var express = require('express');
var socketio = require('socket.io');
var sanitize = require('validator');
var jade = require('jade');

// Application
var app = express();
var server = require('http').createServer(app);
var io = socketio.listen(server);
var pub = __dirname + '/public';

app.use(app.router);
app.use(express.static(pub));
app.use(express.errorHandler());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res){
  res.render('index');
});

// Middlewares
app.use(function(req,res,next) {
    res.send(404, '404 Not Found. Sorry.\n');
});

var usersonline = [];

// Socket
io.sockets.on('connection', function(socket) {

	var connected_user = {};

  setInterval(function() {
    socket.emit('whoshere', { 'clients': usersonline });
  }, 3000);

	socket.on('message', function (message) {
		socket.get('username', function (error, username) {
			var escaped_message = sanitize.escape(message);
			var data = { 'message' : escaped_message, 'username' : username };
			socket.emit('message', data);
		});
	});

  socket.on('disconnect', function () {
  	io.sockets.emit('user disconnected');
	});

	socket.on('setUsername', function (data) {
		console.log("Username: " + username);
		socket.set('username', data);
	});
});

// Listen
server.listen(8000);