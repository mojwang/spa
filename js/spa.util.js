(function (global) {
  /* 
   * spa.util.js
   * General JavaScript utilities
   */

  /* jshint 
    browser: true, devel: true, indent: 2, maxerr: 50, 
    newcap: true, nomen: true, plusplus: true, regexp: true, white: true
   */
  /* global $, spa */

  global.spa.util = (function () {
    var makeError = function (name, msg, data) { 
      var error = new Error();
      error.name = name;
      error.message = msg;

      if (data) { 
        error.data = data;
      }

      return error;
    };

    var setConfigMap = function (arg_map) { 
      var input_map = arg_map.input_map;
      var settable_map = arg_map.settable_map;
      var config_map = arg_map.config_map;

      var key_name;

      for ( key_name in input_map) { 
        if (input_map.hasOwnProperty(key_name)) { 
          if (settable_map.hasOwnProperty(key_name)) {
            config_map[key_name] = input_map[key_name];
          }
          else {
            throw makeError(
              'Bad Input', 
              'Setting config key |' + key_name + '| is not supported'
            );
          }
        }
      }
    };

    return {
      makeError: makeError, 
      setConfigMap: setConfigMap
    };
  }());

}(window));