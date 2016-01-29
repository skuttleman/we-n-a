var express = require('express')
var app = express()

var server = require('http').Server(app)

var io = require('socket.io')(server)

app.use(express.static(__dirname + '/public'))

server.listen(process.env.PORT || 3000, function() {
  console.log('listening...');
});

var score = require('./score');

io.on('connection', function(socket) {
  var initialState = distillScore()
  io.emit('score', initialState)
  socket.on('vote', function(vote) {
    updateScore(vote);
    var response = distillScore();
    io.emit('score', response);
    console.log(response);
  });
});

function distillScore() {
  return Object.keys(score).reduce(function(response, key) {
    response[key] = score[key].value
    return response
  }, {})
}

function updateScore(vote) {
  Object.keys(vote).forEach(function(key) {
    score[key].update(vote[key])
  })
}
