/*
  jQuery Eventralize v0.11
  Copyright 2011, Mark Dalgleish
  
  This content is released under the MIT License
  github.com/markdalgleish/eventralize/blob/master/MIT-LICENSE.txt
  */
(function() {
  var $, $document, $window, delegateHelper, isPressingKeys;
  $ = jQuery;
  $window = $(window);
  $document = $(document);
  $.fn.eventralize = function(eventHash, context, namespace) {
    return delegateHelper(true, this, eventHash, namespace, context);
  };
  $.fn.uneventralize = function(eventHash, namespace) {
    return delegateHelper(false, this, eventHash, namespace);
  };
  delegateHelper = function(isDelegating, collection, eventHash, namespace, context) {
    return collection.each(function() {
      var $elem, eventString, functionName, _results;
      $elem = $(this);
      _results = [];
      for (eventString in eventHash) {
        functionName = eventHash[eventString];
        _results.push((function(functionName) {
          var events, _i, _len, _ref, _results2;
          _ref = eventString.split(', ');
          _results2 = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            events = _ref[_i];
            _results2.push((function() {
              var eventDetails, eventNamespace, eventSelector, eventType, handleEvent, keyString;
              eventDetails = events.split(/\s(.+)/);
              eventType = eventDetails[0];
              eventSelector = eventDetails[1];
              if (eventType.indexOf('.') === -1) {
                eventNamespace = namespace || (typeof functionName === 'string' ? functionName : void 0) || 'eventralize';
                if (eventType.indexOf('(') > 0) {
                  eventType = eventType.replace('(', "." + eventNamespace + "(");
                } else {
                  eventType += "." + eventNamespace;
                }
              }
              if (eventType.indexOf('key') === 0 && eventType.indexOf('(') > 0) {
                keyString = eventType.split('(')[1].replace(')', '');
                eventType = eventType.split('(')[0];
              }
              if (isDelegating === true) {
                handleEvent = function(event) {
                  var func;
                  switch (typeof functionName) {
                    case 'string':
                      if (!(keyString != null) || (keyString != null) && isPressingKeys(keyString, event) === true) {
                        func = context[functionName];
                      }
                      break;
                    case 'function':
                      func = functionName;
                  }
                  return func != null ? func.call(context, event, this) : void 0;
                };
                switch (eventSelector) {
                  case void 0:
                    return $elem.bind(eventType, handleEvent);
                  case 'document':
                    return $document.bind(eventType, handleEvent);
                  case 'window':
                    return $window.bind(eventType, handleEvent);
                  default:
                    return $elem.delegate(eventSelector, eventType, handleEvent);
                }
              } else {
                switch (eventSelector) {
                  case void 0:
                    return $elem.unbind(eventType);
                  case 'document':
                    return $document.unbind(eventType);
                  case 'window':
                    return $window.unbind(eventType);
                  default:
                    return $elem.undelegate(eventSelector, eventType);
                }
              }
            })());
          }
          return _results2;
        })(functionName));
      }
      return _results;
    });
  };
  isPressingKeys = function(keyString, event) {
    var key, keyCode, modifier, special, specialKeys;
    specialKeys = {
      8: 'backspace',
      9: 'tab',
      13: 'return',
      16: 'shift',
      17: 'ctrl',
      18: 'alt',
      19: 'pause',
      20: 'capslock',
      27: 'esc',
      32: 'space',
      33: 'pageup',
      34: 'pagedown',
      35: 'end',
      36: 'home',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      45: 'insert',
      46: 'del',
      112: 'f1',
      113: 'f2',
      114: 'f3',
      115: 'f4',
      116: 'f5',
      117: 'f6',
      118: 'f7',
      119: 'f8',
      120: 'f9',
      121: 'f10',
      122: 'f11',
      123: 'f12'
    };
    keyCode = event.which;
    special = specialKeys[keyCode];
    key = special || String.fromCharCode(event.which).toLowerCase();
    modifier = '';
    if (event.altKey && special !== 'alt') {
      modifier += 'alt+';
    }
    if (event.ctrlKey && special !== 'ctrl') {
      modifier += 'ctrl+';
    }
    if (event.metaKey && !event.ctrlKey && special !== 'ctrl') {
      modifier += 'meta+';
    }
    if (event.shiftKey && special !== 'shift') {
      modifier += 'shift+';
    }
    if (modifier + key === keyString || event.which === keyString) {
      return true;
    } else {
      return false;
    }
  };
}).call(this);
