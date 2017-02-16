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
    ✓ функции вставки блоков
    - bug (повтор скрытия и показа) при двойном клике на выделенный текст

    ✓ fix 1, проблема при выделении выделенного текста
    - отдельный tooltip для каждого поля
    - разные параметры
*/


var seltooltip = (function() {

    "use strict";


    var source = {

        cache: {},

        defaultArray: [

            '<div class="seltooltip-col">',

                // bold text
                '<a data-st-type="exec" data-st-command="bold">Ж</a>',

                // italic text
                '<a data-st-type="exec" data-st-command="italic">I</a>',

                // s text
                '<a data-st-type="exec" data-st-command="strikeThrough">S</a>',

                // split
                '&nbsp;',

                // link
                '<a data-st-type="exec" data-st-command="italic">URL...</a>',

                // mark
                '<a data-st-type="addParent" data-st-command=\'mark,{\"class\":\"myclass\"}\' >MARK</a>',

                // code
                '<a data-st-type="addParent" data-st-command=\'code,{\"class\":\"myclass\", \"style\":\"font-family:monospace;background:#f7f7f7;padding:3px5px;border-radius:3px;margin:5px;box-sizing:border-box;\"}\' >&lt;code></a>',

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

            // calculate sizes,  TODO: calculate если postion за пределы window
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

        range: function( returnSel ) {

            var sel = select.get(), range;

            if( sel.rangeCount ) {
                range = sel.getRangeAt(0);
            }

            return returnSel ? [range, sel] : range;
        },

        text: function() {
            return select.get().toString();
        },

        rect: function() {
            var range = select.range();
            return range ? range.getBoundingClientRect() : false;
        }

    };


    var tools = {

        parseJson: function( json ){

            if( !json ) {
                return;
            }

            try {
                return JSON.parse( json );
            } catch (e) {
                return false;
            }
        },

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
                    tools.applyExectute.call(this, el);
                }
            }

            return true;
        },

        applyExectute: function( el ) {

            var type = el.dataset.stType;
            var command = el.dataset.stCommand;

            if( !type && !command ) {
                return false;
            }

            var regexp = new RegExp('(.+?),(.*?)$','i');
            tools.execute[type].apply(null, regexp.test(command) ? command.match(regexp).slice(1, 3) : [command, false] );
        },

        execute: {
            exec: function( command, value ){
                document.execCommand(command, false, value);
            },

            addParent: function( tag, attr ) {

                var _range = select.range( true ), prop;

                // выходим, если range == false
                if( !_range[0] ) {return;}

                var range = _range[0].cloneRange();
                var selected = range.extractContents();

                // Создаём родителя и задаём ему аттрибуты
                var element = document.createElement(tag);

                // задаём атррибуты если указаны
                var attributes = tools.parseJson(attr);
                if( attributes ) {
                    for( prop in attributes ){
                        element.setAttribute(prop, attributes[prop]);
                    }
                }

                // Вставляем контент
                element.appendChild( selected );
                range.insertNode( element );

                // добавляем выделение
                _range[1].removeAllRanges();
                _range[1].addRange(range);

            }
        }
    };


    var documentEvents = {

        mousedown : function( event ) {

            if( tools.isTooltip(event) ){
                return false;
            }

        },

        mouseup : function( event ) {
            //var parent = select.range().commonAncestorContainer;

            var active = document.activeElement;
            var attribute = active.dataset.seltooltip;

            // Если нажатие на tooltip или кнопку tooltip - остановить и выйти
            if( tools.isTooltip(event, true) ){
                return false;
            }

            // скрывваем tooltip
            tooltip.node.classList.add('hide');

            // проверка на предназначение для элемента
            if( !attribute ){ return; }

            // setTimeout - в данном случае полезный
            // использован как fix для проверки выделения, при отпускании клавиши
            setTimeout( tooltip.show, 0, attribute );

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
