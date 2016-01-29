var socket = io()
var creature = new (function() {
  var state = {
    size: {
      current: 200,
      base: 200
    }
  }
  this.update = {
    size: function(newSize) {
      state.size.current = state.size.base * newSize / 100
      $('.creature').css({
        'width': state.size.current,
        'height': state.size.current
      })
    }
  }
})

socket.on('score', function(score) {
  Object.keys(score).forEach(function(key) {
    creature.update[key](score[key])
  })

})
