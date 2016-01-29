var socket = io();
var creature = new (function() {
  var state = {
    size: {
      height: 300,
      width: 300,
      baseHeight: 300,
      baseWidth: 300
    }
  };
  this.update = {
    size: function(size) {
      state.size.height = state.size.baseHeight * size / 100
      state.size.width = state.size.baseWidth * (100 - size) / 100
    },
    hue: updateProperty(state, 'hue')
  };
  this.updateDisplay = updateDisplay(state);
})();

socket.on('score', function(score) {
  Object.keys(score).forEach(function(key) {
    creature.update[key](score[key])
    creature.updateDisplay();
  })
})

$(document).ready(function() {
  $('.vote-size .up-vote').click(vote('size', 1));
  $('.vote-size .down-vote').click(vote('size', -1));
});

function vote(key, value) {
  return function() {
    socket.emit('vote', { [key]: value});
  };
}

function updateProperty(state, property) {
  return function(value) {
    state[property].current = state[property].base * value / 100;
  }
}

function updateDisplay(state) {
  return function() {
    var $creature = $('.creature');
    $('.creature').css({
      'width': state.size.width,
      'height': state.size.height
    });
  }
}
