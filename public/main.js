var socket = io();
var creature = new (function() {
  var state = {
    ratio: {
      // height: 300,
      // width: 300,
      baseHeight: 300,
      baseWidth: 300
    },
    cuteness: {
      // borderRadius: 50
    },
    brightness: {
      base: 100
    },
    shade: {
      base: 100
    },
    color: {
      creatureBase: 360,
      nucleusBase: 120,
      organelleBase: 240
    }
  };
  this.update = {
    ratio: function(ratio) {
      state.ratio.height = state.ratio.baseHeight * ratio / 100
      state.ratio.width = state.ratio.baseWidth * (100 - ratio) / 100
    },
    cuteness: function(cutenessFactor) {
      state.cuteness.borderRadius = cutenessFactor
    },
    brightness: function(brightFactor) {
      state.brightness.current = brightFactor * 2
    },
    shade: updateProperty(state, 'shade'),
    color: function(colorFactor) {
      state.color.creatureHue = (state.color.creatureBase + (colorFactor * 3)) % 360;
      state.color.nucleusHue = (state.color.nucleusBase + (colorFactor * 3)) % 360;
      state.color.organelleHue = (state.color.organelleBase + (colorFactor * 3)) % 360;
    }
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
    // var $creature = $('.creature');
    $('.creature').css({
      'width': state.ratio.width,
      'height': state.ratio.height,
      'borderRadius': state.cuteness.borderRadius + '%',
      'backgroundColor': makeHsl(state, 'creature')
    });
    $('.organelle').css({
      'backgroundColor': makeHsl(state, 'organelle')
    });
    $('.organelle.nucleus').css({
      'backgroundColor': makeHsl(state, 'nucleus')
    });
  }
}

function makeHsl(state, property) {
  var hue = state.color[property + 'Hue'];
  var saturation = state.brightness.current
  var lightness = state.shade.current
  var hslString =
    'hsl(' +
      hue + ', ' +
      saturation + '%, ' +
      lightness + '%' + ')'
    console.log(hslString)
    return hslString
}
