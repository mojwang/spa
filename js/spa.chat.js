(function (global) { 
  "use strict";

  /* 
   * spa.chat.js
   * Shell module for SPA 
   */

  /* jshint 
     browser: true, devel: true, indent: 2, maxerr: 50, 
     newcap: true, nomen: true, plusplus: true, regexp: true, white: true
   */
  /* global $, spa */

  global.spa.chat = (function () { 
    //------------------- BEGIN MODULE SCOPE VARIABLES ---------------------
    var configMap = {     
      main_html : String() + 
          '<div style="padding:1em; color:#fff;">' + 
              'Say hello to chat' + 
          '</div>', 
      settable_map: {}
    };

    var stateMap = { 
      $container: null
    };

    var jqueryMap = {};
    var setJqueryMap, configModule, initModule;

    //------------------- END MODULE SCOPE VARIABLES -----------------------

    //------------------- BEGIN UTILITY METHODS ----------------------------
    //------------------- END UTILITY METHODS ------------------------------

    //------------------- BEGIN DOM METHODS --------------------------------
    setJqueryMap = function () { 
      var $container = stateMap.$container;
      jqueryMap = { 
        $container: $container 
      };
    };
    //------------------- END DOM METHODS ----------------------------------

    //------------------- BEGIN EVENT HANDLERS -----------------------------
    //------------------- END EVENT HANDLERS -------------------------------

    //------------------- BEGIN PUBLIC METHODS -----------------------------
    configModule = function (input_map) { 
      global.spa.util.setConfigMap({
        input_map: input_map,
        settable_map: configMap.settable_map,
        config_map: configMap
      });

      return true;
    };

    initModule = function ($container) { 
      // load HTML and map jQuery collections
      stateMap.$container = $container;
      $container.html(configMap.main_html);
      setJqueryMap();

      return true;
    };

    //------------------- END PUBLIC METHODS ----------------------------------

    // Export module methods 
    return { 
      initModule: initModule, 
      configModule: configModule 
    };
  }());

}(window));