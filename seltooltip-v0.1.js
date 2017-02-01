/*jshint undef: true, strict: true, funcscope: true, lastsemic: true, multistr: true, browser: true, maxparams: 3, maxdepth: 4*/

/*! 
    Tooltip for selected
	by ReSLeaR- (Korchevskiy Evgeniy) 
	
	2017 (c) CC Attribution 3.0 @license
	https://vk.com/reslear  https://upost.su/
	
!*/

/* TODO:
	- поддержка textarea
	- позиция если за размерами окнаа
	- ...
	- функции вставки текста 
	- расшарить в vk, twitter
*/


var seltooltip = (function() {
	
    "use strict";
	
	var SOURCE = {};
	
	var tooltip = {
				
		create: function() {
				
			tooltip.node = document.createElement('div');
			tooltip.node.className = 'seltooltip hide';

			document.body.appendChild( tooltip.node );
		}
	};
	
	var select = {

		get: function() {
			return window.getSelection();
		},

		range: function() {
			return select.get().getRangeAt(0);
		},

		text: function() {
			return select.get().toString();
		},

		rect: function() {
			return select.range().getBoundingClientRect();
		}

	};
	
	var documentEvents = {
		
		mousedown : function( event ){
			
			//event.preventDefault();
			tooltip.node.classList.add('hide');
		},
		
		mouseup : function( event ) {
			
			
			var parent = select.range().commonAncestorContainer.parentElement;
			var attribute = parent.getAttribute('seltooltip');
			
			if( !attribute || !SOURCE.hasOwnProperty(attribute) || !select.text().length || event.target == tooltip.node ){
				return false;
			}
			
			// add html
			var source = SOURCE[attribute];
			tooltip.node.innerHTML = typeof source === "string" ? source : source.outerHTML;
			
			// calculate sizes 
			var rect = select.rect();
			var node = tooltip.node.getBoundingClientRect();
			
			var left = window.pageXOffset + rect.left + (rect.width / 2) - (node.width /2 );
			var top = window.pageYOffset + rect.top - node.height - 25;
			
			tooltip.node.style.cssText = 'left:' + left+ 'px;top:' + top +'px';
			
			// show tooltip
			tooltip.node.classList.remove('hide');
	
		}
		
	};
	
	
	var publicFunctions = {
		
		source: SOURCE,
		
		init: function( source ) {
			
			// сохраняем данные
			SOURCE = source || {};
			
			// добавляем события документу
			document.onmousedown = documentEvents.mousedown;
			document.onmouseup = documentEvents.mouseup;
			
			// создаём тултип
			tooltip.create( source );
		}
    };
	
	return publicFunctions;
	
})();

