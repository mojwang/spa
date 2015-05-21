(function (global) {
  "use strict";

  /*
   * spa.js
   * Root namespace module
   */

  /* jshint
     browser: true, devel: true, indent: 2, maxerr: 50, 
     newcap: true, nomen: true, plusplus: true, regexp: true, white: true
   */
  /* global $, spa */

  global.spa = (function () {
    var initModule = function ($container) {
        spa.shell.initModule($container);
    };

    return { initModule: initModule };
  }());

}(window));
