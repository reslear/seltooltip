/*jshint undef: true, strict: true, funcscope: true, lastsemic: true, multistr: true, browser: true, maxparams: 3, maxdepth: 4*/

/* 
    Tooltip for selected v0.2
	by ReSLeaR- (Korchevskiy Evgeniy) 
	
	2017 (c) CC Attribution 3.0 @license
	https://vk.com/reslear  https://upost.su/
	
*/

/* TODO:
	- поддержка textarea
	- позиция если за размерами окнаа
	- ...
	- функции вставки текста 
	- bug (повтор скрытия и показа) при двойном клике на выделенный текст
	
	✓ fix 1, проблема при выделении выделенного текста
*/


var seltooltip = (function() {
	
    "use strict";
	
	var utils = {
		
		extend: function( object1, object2 ) {
			
			for( var key in object2 ) {
				
				if( !object1.hasOwnProperty( key ) ){
					continue;
				}
				
				var hasArray = Array.isArray(object1[key]) && Array.isArray(object2[key]);
				object1[key] = hasArray ? object1[key].concat(object2[key]) : object2[key];
			}
			
			return object1;
			
		}
	};
	
	var source = {
		
		cache: {},
		
		defaultArray: [
			
			'<div class="seltooltip-col">', 
			
				// bold text
				'<a data-st-command="bold">Ж</a>',

				// italic text
				'<a data-st-command="italic">I</a>',

				// s text
				'<a data-st-command="strikeThrough">S</a>',

				// split 
				'&nbsp;',

				// link
				'<a data-st-command="italic">URL...</a>',
			
			'</div>'

		],

	
		init: function() {
			source.cache = { 'default': source.defaultArray.join('') };
		}
		
	};
	

	var tooltip = {

		create: function() {
				
			tooltip.node = document.createElement('div');
			tooltip.node.className = 'seltooltip hide';
			
			tooltip.node.innerHTML = '<div class="seltooltip-wrap"></div>';
			
			document.body.appendChild( tooltip.node );
		},
		
		show: function( attribute) {
			
			// Выходим, если нет выделения
			if( !select.text().length ) {
				return false;
			}
			
			var config = source.cache;
			
			// add html
			var elemSource = config[attribute];
			
			if( typeof elemSource === "string" ) {
				
				tooltip.node.firstChild.innerHTML = elemSource;
				
			} else if( tooltip.node ){
				
				tooltip.node.innerHTML = '';
				tooltip.node.appendChild( elemSource.cloneNode(true) );
			}
			
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
	var exec = {
		clickEvent: function( el ){
			var command = el.dataset.stCommand;
			
			if( !command ) {
				return false;
			}
			
			document.execCommand(command, false, false);
		},	
	};
	
	var check = {
		isTooltip: function( event, fx ) {
			
			var el = event.target;
			
			if( el !== tooltip.node && !tooltip.node.contains(el) ) {
				return false;
			}
				
			event.preventDefault();
			event.stopPropagation();
				
			// TODO: while( parentElement)
			if( el.dataset.hasOwnProperty('stCommand') ){
				if( fx ) {
					fx.call(this, el);
				}
			}

			return true;
		}
	};
	
	
	var documentEvents = {
	
		mousedown : function( event ) {
			
			if( check.isTooltip(event) ){
				return false;	
			}
			
		},
		
		mouseup : function( event ) {
			//var parent = select.range().commonAncestorContainer;
			
			var active = document.activeElement;
			var attribute = active.dataset.seltooltip;			
			
			// Если нажатие на tooltip или кнопку tooltip - остановить и выйти
			if( check.isTooltip(event, exec.clickEvent) ){
				return false;	
			}
			
			// скрывваем tooltip
			tooltip.node.classList.add('hide');
			
			// проверка на предназначение для элемента 
			if( !attribute ){ return; }

			// setTimeout - в данном случае полезный
			// использован как fix для проверки выделения, при отпускании клавиши
			setTimeout( tooltip.show, 100, attribute );
	
		}
		
	};
	
	var publicMethods = {
		
		
	};
	
	// инициализируем содержимое титла
	source.init();
	
	// добавляем события документу
	document.onmousedown = documentEvents.mousedown;
	document.onmouseup = documentEvents.mouseup;

	// создаём тултип
	tooltip.create();
	
	
	// возвращаем публичные методы 
	return publicMethods;
	
})();

