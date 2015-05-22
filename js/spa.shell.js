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
      anchor_schema_map: { 
        chat: { 
          open: true, 
          closed: true
        }
      },
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
      anchor_map: {},
      is_chat_retracted: true
    };

    var jqueryMap = {};
    var setJqueryMap, initModule, toggleChat;
    var onClickChat, onHashChange;
    var copyAnchorMap, changeAnchorPart;

    //------------------- END MODULE SCOPE VARIABLES -----------------------
    //------------------- BEGIN UTILITY METHODS ----------------------------
    copyAnchorMap = function () { 
      return $.extend(true, {}, stateMap.anchor_map);
    };
    //------------------- END UTILITY METHODS ------------------------------
    //------------------- BEGIN DOM METHODS --------------------------------
    changeAnchorPart = function (arg_map) { 
      var anchor_map_revise = copyAnchorMap();
      var bool_return = true;
      var key_name, key_name_dep;

      // Begin merge changes into anchor map
      KEYVAL:
      for(key_name in arg_map) {
        if (arg_map.hasOwnProperty(key_name)) { 
          // skip dependent keys during iteration
          if (key_name.indexOf('_') === 0) { continue KEYVAL; }

          // update independent key value
          anchor_map_revise[key_name] = arg_map[key_name];

          // update marching dependent key
          key_name_dep = '_' + key_name;
          if (arg_map[key_name_dep]) {
            anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
          }
          else { 
            delete anchor_map_revise[key_name_dep];            
            delete anchor_map_revise['' + key_name_dep];
          }
        }
      }
      // End merge changes into anchor map

      // Begin attempt to update URI; revert if not successful
      try {
        $.uriAnchor.setAnchor(anchor_map_revise); 
      }
      catch (e) { 
        $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
        bool_return = false;
      }
      // End attempt to update URI

      return bool_return;
    };

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

    onHashChange = function (event) { 
      var anchor_map_proposed, anchor_map_previous = copyAnchorMap(); 
      var s_chat_proposed, _s_chat_previous, _s_chat_proposed;

      // Attempt to parse anchor
      try {
        anchor_map_proposed = $.uriAnchor.makeAnchorMap(); 
      } 
      catch (e) { 
        $.uriAnchor.setAnchor(anchor_map_previous, null, true);
        return false;
      }

      stateMap.anchor_map = anchor_map_proposed;
      _s_chat_previous = anchor_map_previous._s_chat;
      _s_chat_proposed = anchor_map_proposed._s_chat;

      // Begin adjust chat component if changed
      if (!anchor_map_proposed || _s_chat_previous !== _s_chat_proposed) { 
        s_chat_proposed = anchor_map_proposed.chat;
        switch(s_chat_proposed) { 
          case 'open':
            toggleChat(true); 
            break;
          case 'closed':
            toggleChat(false); 
            break;
          default:
            toggleChat(false);
            delete anchor_map_proposed.chat;
            $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
        }
      }
      // End adjust chat component 

      return false;
    };

    onClickChat = function (event) { 
      changeAnchorPart({
        chat: stateMap.is_chat_retracted ? 'open' : 'closed' 
      });
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

      $.uriAnchor.configModule({
        schema_map: configMap.anchor_schema_map
      });

      // Configure and initialize feature modules 
      global.spa.chat.configModule({});
      global.spa.chat.initModule(jqueryMap.$chat);

      // Handle URI anchor change event
      // This is done after all feature modules are configured and 
      // initialized, otherwise they will not be ready to handle the trigger
      // event, which is used to ensure the anchor is considered.

      $(window)
        .bind('hashchange', onHashChange)
        .trigger('hashchange');
    };

    //------------------- END PUBLIC METHODS ----------------------------------

    return { initModule: initModule };
  }());

}(window));