var socket = io();
var creature = new (function() {
  var state = {
<<<<<<< HEAD
    ratio: {
=======
    size: {
>>>>>>> acc58a65c6f1ef28d2727791e8f958453f3a05ec
      height: 300,
      width: 300,
      baseHeight: 300,
      baseWidth: 300
    }
  };
  this.update = {
    ratio: function(ratio) {
      state.ratio.height = state.ratio.baseHeight * ratio / 100
      state.ratio.width = state.ratio.baseWidth * (100 - ratio) / 100
    },
    // hue: updateProperty(state, 'hue')
  };
  this.updateDisplay = updateDisplay(state);
})();

socket.on('score', function(score) {
  Object.keys(score).forEach(function(key) {
    if (creature.update[key]) creature.update[key](score[key]);
  });
  creature.updateDisplay();
});

$(document).ready(function() {
  [
    'ratio', 'shade', 'color', 'brightness', 'cuteness',
  ].forEach(function(name) {
    $('.vote-' + name + ' .up-vote').click(vote(name, 1));
    $('.vote-' + name + ' .down-vote').click(vote(name, -1));
  });
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
    $creature.css({
      'width': state.ratio.width,
      'height': state.ratio.height
    });
  }
}
