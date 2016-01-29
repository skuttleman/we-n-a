module.exports = {
  ratio: {
    min: 1,
    max: 100,
    value: 50,
    update: update
  },
  shade: {
    min: 1,
    max: 100,
    value: 50,
    update: update
  },
  color: {
    min: 1,
    max: 100,
    value: 50,
    update: update
  },
  brightness: {
    min: 1,
    max: 100,
    value: 50,
    update: update
  },
  cuteness: {
    min: 1,
    max: 100,
    value: 50,
    update: update
  }
};

function update(vote) {
  this.value = updateValue(this.min, this.max, this.value, vote)
}

function updateValue(min, max, value, vote) {
  if (value + vote >= min && value + vote <= max) {
    return value + vote
  } else {
    return value
  }
}
