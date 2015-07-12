var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
	console.log('A user connected');
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