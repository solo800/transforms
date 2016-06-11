$(document).ready(function () {
  var trans = Transform({intervalMS: 750});

  var trans2 = Transform({elem: $('.as-trans.container'), intervalMS: 2000});

  trans.randomize();
  trans2.randomize();
});

function Transform (args) {
  var defArgs = {
    type: {
      value: '2d',
      check: function (argVal) {
        var validTypes = ['2d', '3d'];

        if (!_checkType('[object String]', argVal)) {
          return false;
        }
        else if (-1 === validTypes.indexOf(argVal)) {
          return false;
        }
        return true;
      }
    },
    elem: {
      value: $('.as-trans.matrix'),
      check: function (argVal) {
        if (!(argVal instanceof $)) {
          return false;
        }
        else if (0 === argVal.length) {
          return false;
        }
        return true;
      }
    },
    interval: {
      value: 1.2,
      check: function (argVal) {
        if (!_checkType('[object Number]', argVal)) {
          return false;
        }
        return true;
      }
    },
    intervalMS: {
      value: 1200,
      check: function (argVal) {
        if (!_checkType('[object Number]', argVal)) {
          return false;
        }
        return true;
      }
    }
  },
  _randomize2d = function () {
    var elem = args.elem,
      matrix, matrixStr;

    var interval = window.setInterval(function () {
      matrix = _validateMatrix('2d', _getMatrix(elem));

      _randomizeScale('2d', matrix);
      _randomizeSkew('2d', matrix);

      matrixStr = _buildMatrixString(matrix);

      console.log(matrix, matrixStr);

      elem.css('transform', matrixStr);

      // window.clearInterval(interval);
    }, args.intervalMS);
  },
  _buildMatrixString = function (matrix) {
    var str = 6 === matrix.length ? 'matrix(' : 'matrix3d(';

    matrix.forEach(function (val, i) {
      str += String(val);
      if (i + 1 === matrix.length) {
        str += ')';
      }
      else {
        str += ', ';
      }
    });

    return str;
  },
  _randomizeSkew = function (type, matrix) {
    if ('2d' === type) {
      for (var i = 1; i <= 2; i++) {
        if (!_chance.seventyThirty()) {
          // Chance skew entirely
          matrix[i] = _getRand(1, 0.3) * (_chance.fiftyFifty() ? 1 : -1);
        }
        else {
          // Increment skew
          matrix[i] += _getRand(1, 0.1, 0.3) * (_chance.fiftyFifty() ? 1 : -1);
        }
      }
    }
    return matrix;
  },
  _randomizeScale = function (type, matrix) {
    if ('2d' === type) {
      for (var i = 0; i <= 1; i++) {
        i = i === 1 ? 3 : i;
        if (!_chance.seventyThirty()) {
          // Just change scale
          matrix[i] = _getRand(1, 0.2);
        }
        else {
          // Increment scale
          var n;
          while(true) {
            n = matrix[i];
            n += _getRand(1, 0.1, 0.6) * (_chance.fiftyFifty() ? 1 : -1);
            if (n > 0) break;
          }
          matrix[i] = n;
        }
      }
    }
    return matrix;
  },
  _getMatrix = function (elem) {
    return elem.css('transform').split(',').map(function(val) {
      return val.replace('matrix(', '').replace('matrix3d(', '').replace(')', '').trim() * 1;
    });
  },
  _validateMatrix = function (type, matrix) {
    console.log(type, matrix);
    var mat2d = [
      1, 0, 0,
      1, 0, 0
    ],
    mat3d = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ],
    defMatrix = '2d' === type ? mat2d : mat3d;

    if (!_checkType('[object Array]', matrix)) {
      matrix = defMatrix;
    }

    if (defMatrix.length !== matrix.length) {
      matrix = defMatrix;
    }

    return defMatrix.map(function (val, i) {
      return _getType(val) !== _getType(matrix[i]) ? val : matrix[i];
    });
  },
  _validateArgs = function (args) {
    if ('undefined' === typeof args) {
      args = _setAllDefaultArgs();
    }
    else {
      for (arg in defArgs) {
        if ('undefined' === typeof args[arg]) {
          args[arg] = defArgs[arg].value;
        }
        else if (!defArgs[arg].check(args[arg])) {
          args[arg] = defArgs[arg].value;
        }
      }
    }
    return args;
  },
  _setAllDefaultArgs = function () {
    args = {};
    for (arg in defArgs) {
      args[arg] = defArgs[arg].value;
    }
    return args;
  },
  _getRand = function (base, min, max) {
    var n,
      base = _checkType('[object Number]', base) ? base : 1,
      min = _checkType('[object Number]', min) ? min : 0,
      max = _checkType('[object Number]', max) ? max : base;

    var iter = 0;
    while(true && iter < 1000) {
      ++iter;
      n = Math.random() * base;
      if (n >= min && n <= max) break;
    }
    return n;
  },
  _getType = function (variable) {
    return Object.prototype.toString.call(variable);
  }
  _checkType = function (type, variable) {
    return type === _getType(variable);
  },
  _chance = {
    fiftyFifty: function () {
      return _getRand() > 0.5;
    },
    sixtyForty: function () {
      return _getRand() > 0.4;
    },
    seventyThirty: function () {
      return _getRand() > 0.3;
    },
    eightyTwenty: function () {
      return _getRand() > 0.2;
    },
    ninetyTen: function () {
      return _getRand() > 0.1;
    }
  },
  __transInit__ = function (args) {
    return _validateArgs(args);
  },
  randomize = function (randomizeArgs) {
    if ('undefined' === typeof randomizeArgs) {
      randomizeArgs = args;
    }
    if ('2d' === args.type) {
      _randomize2d(randomizeArgs);
    }
  };

  args = __transInit__(args);

  console.log('validated args are', args);

  return {
    randomize: randomize
  }
}
