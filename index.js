var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var connectedUsers = {},
	contUsers = 0;

io.on('connection', function(socket){
	socket.on('add user', function(user){
		socket.username = user;
		connectedUsers[user] = user;
		++contUsers;

		socket.emit('login', {
			numUsers: contUsers
		});

		socket.broadcast.emit('user joined', {
			user: socket.username,
			numUsers: contUsers
		});
	});

	socket.on('new message', function(data){
		socket.broadcast.emit('new message', data);
	});

	socket.on('disconnect user', function(user){
		delete connectedUsers[user];
		--contUsers;

		socket.broadcast.emit('user left', {
			user: user,
			numUsers: contUsers
		});
	});
});

app.set('port', port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.render('index', {});
});

http.listen(port, function(){
	console.log('Listening on port: ' + port);
});

module.exports = app;