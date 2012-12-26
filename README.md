[Eventralize](http://markdalgleish.com/projects/eventralize) - jQuery Events for Object Oriented JavaScript
===========================================================================================================

Event handling done right.
--------------------------

Provide a hash of mouse/keyboard events, selectors and function names - Eventralize will do the rest.

``` js
$('#element').eventralize({
  'event'          : 'functionName',
  'event selector' : 'functionName',
  'event selector, keydown(key) selector' : 'functionName'
}, context, 'namespace'); // <- Optional event namespace
```

Centralize your events.
-----------------------

Keep your event handling logic in one place and enable or disable everything with only a single line.

``` js
Gallery.prototype = {
    events: {
      'dblclick img' : 'zoom',
      'click .close, keydown(esc) document'  : 'close',
      'click .next, keydown(right) document' : 'next',
      'click .prev, keydown(left) document'  : 'prev'
    },
    init: function(elem){
      this.$elem = $(elem).eventralize(this.events, this);
    },
    destroy: function() {
      this.$elem.uneventralize(this.events);
    },
    //All functions are passed an extended 'event' object
    zoom  : function(event) { ... },
    close : function(event) { ... },
    next  : function(event) { ... },
    prev  : function(event) { ... }
};
```

Note: While generally discouraged, it's possible to use inline functions or function variables rather
a string with the function name. This may be useful for classes that consist almost entirely of event handlers,
or for event handlers with only a couple lines of code. For example:

``` js
Gallery.prototype = {
    events: {
        'dblclick img' : function() { ... },
        ...
    }
    ...
}
```


Keyboard events made easy.
--------------------------

Bind individual key presses or combinations at the same time as your mouse events.

``` js
events: {
  'click .money, keydown(shift+4) document' : 'money'
},
init: function(elem){
  this.$elem = $(elem).eventralize(this.events, this);
}
money: function() {
  alert('Vegas, baby!');
}
```

Bind locally or globally.
-------------------------

Bind events to the element or delegate based on your selector—or bind to the document, window or body.

``` js
events: {
  'click' : 'focus',
  'click .toolbar .save' : 'save',
  'scroll window' : 'handleScroll',
  'resize window, orientationchange document' : 'reposition'
}
```

Namespace everything at once.
-----------------------------

Provide a namespace as the optional third parameter and all of your events will be correctly namespaced.

``` js
Gallery.prototype = {
    events: {
      ...
    },
    init: function(elem) {
      this.$elem = $(elem);
      this.$elem.eventralize(this.events, this, 'gallery');
    }
    destroy: function() {
      this.$elem.uneventralize(this.events, 'gallery');
    }
}
```

Full event functionality
------------------------

All functions are passed an extended 'event' object so you don't have to repeat yourself.

``` js
zoom: function(event) {
  event.eventralize; //True
  
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget; //The element matching the selector
}
```

How to Build
------------

The code is compiled using CoffeeScript and minified using UglifyJS using the following commands:

``` bash
coffee -c jquery.eventralize.coffee
uglifyjs -o jquery.eventralize.min.js jquery.eventralize.js
````

Contributing to Eventralize
---------------------------

Make sure you move the copyright/license block comment to the top of the compiled and minified JavaScript files before committing.

If you want to contribute in a way that changes the API, please file an issue before submitting a pull request so we can discuss how to appropriately integrate your ideas.

Questions?
----------

Contact me on GitHub or Twitter: [@markdalgleish](http://twitter.com/markdalgleish)