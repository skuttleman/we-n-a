var socket = io();
var creature = new (function() {
  var state = {
    ratio: {
      height: 300,
      width: 300,
      baseHeight: 300,
      baseWidth: 300
    },
    cuteness: {
      borderRadius: 50
    },
    brightness : {
      base: 100
    }
  };
  this.update = {
    ratio: function(ratio) {
      state.ratio.height = state.ratio.baseHeight * ratio / 100
      state.ratio.width = state.ratio.baseWidth * (100 - ratio) / 100
    },
    cuteness: function(cutenessFactor) {
      state.cuteness.borderRadius = cutenessFactor * 2.5
    },
    brightness: updateProperty(state, 'brightness')
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
      'height': state.ratio.height,
      'borderRadius': state.cuteness.borderRadius + '%',
      'backgroundColor': makeHsl(state)
    });
  }
}

function makeHsl(state) {
  var hue = 200
  var saturation = state.brightness.current
  var lightness = 50
  var hslString =
    'hsl(' +
      hue + ', ' +
      saturation + '%, ' +
      lightness + '%' + ')'
    console.log(hslString)
    return hslString
}
