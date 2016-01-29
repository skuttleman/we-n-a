var express = require('express')
var app = express()

var server = require('http').Server(app)

var io = require('socket.io')(server)

app.use(express.static(__dirname + '/public'))

app.listen(3000, function() {
  console.log('listening...');
});


var score = {
  size: {
    min: 0,
    max: 100,
    value: 0,
    update: update
  }
}

io.on('connection', function(socket) {
  socket.on('vote', function(vote) {
    var response = Object.keys(vote).reduce(function(response, key) {
      score[key].update(vote[key])
      response[key] = score[key].value
      return response
    }, {})
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
