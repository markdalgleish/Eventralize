###
jQuery Eventralize v0.1
Copyright 2011, Mark Dalgleish

This content is released under the MIT License
github.com/markdalgleish/eventralize/blob/master/MIT-LICENSE.txt
###
$ = jQuery
$window = $ window
$document = $ document

$.fn.eventralize = (eventHash, context, namespace) ->
	delegateHelper true, this, eventHash, namespace, context

$.fn.uneventralize = (eventHash, namespace) ->
	delegateHelper false, this, eventHash, namespace

delegateHelper = (isDelegating, collection, eventHash, namespace, context) ->
	collection.each ->
		$elem = $ this
		
		for eventString, functionName of eventHash
			do (functionName) ->
				for events in eventString.split ', '
					do ->
						#Split string on first space
						eventDetails = events.split /\s(.+)/
					
						eventType = eventDetails[0]
						eventSelector = eventDetails[1]
						
						#Check if a namespace was supplied
						if eventType.indexOf('.') is -1
							#If the namespace parameter wasn't defined, use the function name, or 'eventralize' if it's an anonymous function
							eventNamespace = namespace or (functionName if typeof functionName is 'string') or 'eventralize'
							
							#Add the namespace before the bracket for keyboard syntax, otherwise append
							if eventType.indexOf('(') > 0
								eventType = eventType.replace '(', ".#{eventNamespace}("
							else
								eventType += ".#{eventNamespace}"
		
						#Handle 'event(keycode)' syntax
						if eventType.indexOf('key') is 0 and eventType.indexOf('(') > 0
							keyString = eventType.split('(')[1].replace(')','')
							eventType = eventType.split('(')[0]
						
						if isDelegating is true
							#Call the function in the supplied context
							handleEvent = (event) ->
								switch typeof functionName
									when 'string'
										if !keyString? or keyString? and isPressingKeys(keyString, event) is true
											func = context[functionName]
									when 'function' then func = functionName

								func?.call(context, event)
								
							#Delegate/bind
							switch eventSelector
								when undefined then $elem.bind eventType, handleEvent
								when 'document'	then $document.bind eventType, handleEvent
								when 'window' then $window.bind eventType, handleEvent
								else $elem.delegate eventSelector, eventType, handleEvent
						else
							#Undelegate/unbind
							switch eventSelector
								when undefined then $elem.unbind eventType
								when 'document' then $document.unbind eventType
								when 'window' then $window.unbind eventType
								else $elem.undelegate eventSelector, eventType
	

isPressingKeys = (keyString, event) ->
	specialKeys =
		8: 'backspace'
		9: 'tab'
		13: 'return'
		16: 'shift'
		17: 'ctrl'
		18: 'alt'
		19: 'pause'
		20: 'capslock'
		27: 'esc'
		32: 'space'
		33: 'pageup'
		34: 'pagedown'
		35: 'end'
		36: 'home'
		37: 'left'
		38: 'up'
		39: 'right'
		40: 'down'
		45: 'insert'
		46: 'del'
		112: 'f1'
		113: 'f2'
		114: 'f3'
		115: 'f4'
		116: 'f5'
		117: 'f6'
		118: 'f7'
		119: 'f8'
		120: 'f9'
		121: 'f10'
		122: 'f11'
		123: 'f12'

	keyCode = event.which
	special = specialKeys[keyCode]
	key = special or String.fromCharCode(event.which).toLowerCase()
	
	modifier = ''
	modifier += 'alt+' if event.altKey and special isnt 'alt'
	modifier += 'ctrl+' if event.ctrlKey and special isnt 'ctrl'
	modifier += 'meta+' if event.metaKey and !event.ctrlKey and special isnt 'ctrl'
	modifier += 'shift+' if event.shiftKey and special isnt 'shift'

	#Check whether the keys pressed match the 'keyString' passed into the function 
	if modifier + key is keyString or event.which is keyString then true else false