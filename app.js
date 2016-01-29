var express = require('express')
var app = express()

var server = require('http').Server(app)

var io = require('socket.io')(server)

app.use(express.static(__dirname + '/public'))

server.listen(process.env.PORT || 3000, function() {
  console.log('listening...');
});

var score = {
  size: {
    min: 1,
    max: 100,
    value: 20,
    update: update
  }
}

io.on('connection', function(socket) {
  var initialState = distillScore()
  io.emit('score', initialState)
  socket.on('vote', function(vote) {
    updateScore(vote)
    var response = distillScore()
    io.emit('score', response)
  })
})

function updateValue(min, max, value, vote) {
  if (value + vote >= min && value + vote <= max) {
    return value + vote
  } else {
    return value
  }
}

function update(vote) {
  this.value = updateValue(this.min, this.max, this.value, vote)
}

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
