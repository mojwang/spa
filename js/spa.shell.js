(function (global) { 
  "use strict";

  /* 
   * spa.shell.js
   * Shell module for SPA 
   */

  /* jshint 
     browser: true, devel: true, indent: 2, maxerr: 50, 
     newcap: true, nomen: true, plusplus: true, regexp: true, white: true
   */
  /* global $, spa */

  global.spa.shell = (function () { 
    //------------------- BEGIN MODULE SCOPE VARIABLES ---------------------
    var configMap = { 
      main_html : String() + 
          '<div class="spa-shell-head">' + 
              '<div class="spa-shell-head-logo"></div>' + 
              '<div class="spa-shell-head-acct"></div>' +
              '<div class="spa-shell-head-search"></div>' +
          '</div>' +
          '<div class="spa-shell-main">' +
              '<div class="spa-shell-main-nav"></div>' +
              '<div class="spa-shell-main-content"></div>' +
          '</div>' +
          '<div class="spa-shell-foot"></div>' +
          '<div class="spa-shell-chat"></div>' +
          '<div class="spa-shell-modal"></div>', 
      chat_extend_time: 1000,
      chat_retract_time: 300,
      chat_extend_height: 450,
      chat_retract_height: 15, 
      chat_extended_title: 'Click to retract',
      chat_retracted_title: 'Click to extend'
    };

    var stateMap = { 
      $container: null,
      is_chat_retracted: true
    };

    var jqueryMap = {};
    var setJqueryMap, initModule, toggleChat, onClickChat;

    //------------------- END MODULE SCOPE VARIABLES -----------------------
    //------------------- BEGIN UTILITY METHODS ----------------------------
    //------------------- END UTILITY METHODS ------------------------------
    //------------------- BEGIN DOM METHODS --------------------------------

    setJqueryMap = function () { 
      var $container = stateMap.$container;
      jqueryMap = { 
        $container: $container,
        $chat: $container.find('.spa-shell-chat') 
      };
    };

    toggleChat = function (do_extend, callback) { 
      var px_chat_ht = jqueryMap.$chat.height();
      var is_open = px_chat_ht === configMap.chat_extend_height;
      var is_closed = px_chat_ht === configMap.chat_retract_height;
      var is_sliding = !is_closed && !is_open;

      // Avoid race condition
      if (is_sliding) return false;

      // Extend chat slider
      if (do_extend) { 
        jqueryMap.$chat.animate( 
          { height: configMap.chat_extend_height },
          configMap.chat_extend_time, 
          function () {
            jqueryMap.$chat.attr('title', configMap.chat_extended_title);
            stateMap.is_chat_retracted = false;

            if (callback) callback(jqueryMap.$chat); 
          }
        );

        return true;
      }

      // Retract chat slider
      jqueryMap.$chat.animate(
        { height: configMap.chat_retract_height },
        configMap.chat_retract_time,
        function () {
          jqueryMap.$chat.attr('title', configMap.chat_retracted_title);
          stateMap.is_chat_retracted = true;

          if (callback) callback(jqueryMap.$chat); 
        }
      );

      return true;
    };

    //------------------- END DOM METHODS ----------------------------------
    //------------------- BEGIN EVENT HANDLERS -----------------------------

    onClickChat = function (event) { 
      toggleChat(stateMap.is_chat_retracted);
      return false;
    };

    //------------------- END EVENT HANDLERS -------------------------------
    //------------------- BEGIN PUBLIC METHODS -----------------------------
    initModule = function ($container) { 
      // load HTML and map jQuery collections
      stateMap.$container = $container;
      $container.html(configMap.main_html);
      setJqueryMap();

      // Initialize chat slider and bind click handler
      stateMap.is_chat_retracted = true;
      jqueryMap.$chat
        .attr('title', configMap.chat_retracted_title)
        .click(onClickChat);
    };

    //------------------- END PUBLIC METHODS ----------------------------------

    return { initModule: initModule };
  }());

}(window));