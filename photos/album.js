(function addCssToDocument() {
	var style = document.createElement("style");
	style.type="text/css";
	style.innerHTML=[
		'.viewer, .text, .thumbnails { text-align: center; }',
		'.viewer span{ display: inline-block; vertical-align: middle; height: 100%; }',
		'.viewer img { display: inline-block; vertical-align: middle; max-width:100%; max-height:100%; }',
		'.thumbnails a{ display:inline-block; }',
		'.thumbnails .selected { outline-offset: -1px; }',
		'.thumbnails.small { overflow-x: scroll; white-space: nowrap; }',
	].join('');
	document.getElementsByTagName("head")[0].appendChild(style);
})();



function outerHeight(elm) {
	if(elm.currentStyle) {
		return parseFloat(elm.currentStyle.height) +
				parseFloat(elm.currentStyle.paddingTop) +
				parseFloat(elm.currentStyle.paddingBottom) +
				parseFloat(elm.currentStyle.marginTop) +
				parseFloat(elm.currentStyle.marginBottom);
	}
	if(document.defaultView && document.defaultView.getComputedStyle) {
		var style = document.defaultView.getComputedStyle(elm, '');
		return parseFloat(style.getPropertyValue('height')) +
				parseFloat(style.getPropertyValue('padding-top')) +
				parseFloat(style.getPropertyValue('padding-bottom')) +
				parseFloat(style.getPropertyValue('margin-top')) +
				parseFloat(style.getPropertyValue('margin-bottom'));
	}
};

function openLayer() {
	var viewer = document.querySelector('.viewer');
	var thumbnails = document.querySelector('.thumbnails');
	var text = document.querySelector('.text');
	// start loading the image
	viewer.querySelector('img').src = this.href;
	// prepare the thumbnail box
	thumbnails.className='thumbnails small';
	if(document.querySelector('.selected'))
		document.querySelector('.selected').className = '';
	this.className = 'selected';
	this.focus();
	if(this.offsetLeft < thumbnails.offsetLeft+thumbnails.scrollLeft
	|| this.offsetLeft > thumbnails.offsetLeft+thumbnails.scrollLeft+thumbnails.offsetWidth-this.offsetWidth)
		thumbnails.scrollLeft=this.offsetLeft+this.offsetWidth/2-thumbnails.offsetWidth/2-thumbnails.offsetLeft
	// prepare the text
	if(typeof (comment=comments[decodeURIComponent(this.href.slice(this.href.lastIndexOf('/')+1))]) == 'object') {
		if(comment[navigator.language])
			text.innerHTML=comment[navigator.language];
		else if(comment[navigator.language.slice(0,2)])
			text.innerHTML=comment[navigator.language.slice(0,2)];
		else
			for(var lang in comment) {
				text.innerHTML=comment[lang];
				break;
			}
	} else
		text.innerHTML=comment;
	// prepare the viewer
	viewer.style.height=window.innerHeight - outerHeight(text) - outerHeight(thumbnails) + 'px';
	viewer.style.display = 'block';
	window.scrollTo(0,viewer.offsetTop);
	return false; //to cancel <a href navigation
};

(function fixLinks(elems) {
	for( var i=0; i<elems.length; i++) {
		elems[i].onclick=openLayer;
	}
})(document.querySelectorAll('.thumbnails a'));

function openNext(){
	var cur=document.querySelector('.selected');
	if(cur && cur.nextElementSibling)
		openLayer.call(cur.nextElementSibling);
	else
		openLayer.call(document.querySelector('.thumbnails a:first-child'));
}

function openPrev(){
	var cur=document.querySelector('.selected');
	if(cur && cur.previousElementSibling)
		openLayer.call(cur.previousElementSibling);
	else
		openLayer.call(document.querySelector('.thumbnails a:last-child'));
}

document.querySelector('.viewer img').onclick=openNext;
window.onkeydown=function(event){
	switch(event.keyCode) {
		case 9: //Tab
		case 13://Enter
		case 32://Space
		case 34://Page down
		case 39://Right arrow
		case 40://Down arrow
		case 90://z
		case 106://KP multiply
		case 107://KP plus
		case 171://plus
			openNext();
			return false;
		case 8: //Backspace
		case 27://Esc
		case 33://Page up
		case 37://Left arrow
		case 38://Up arrow
		case 65://a
		case 109://KP minus
		case 111://KP divide
		case 173://minus
			openPrev();
			return false;
	}
};

// how hard can it be to create an event listener?
// https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function createWheelListener(window,document) {
    var prefix = "", _addEventListener, support;
    // detect event model
    if ( window.addEventListener ) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }
    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
              document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
              "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
    window.addWheelListener = function( elem, callback, useCapture ) {
        _addWheelListener( elem, support, callback, useCapture );
        // handle MozMousePixelScroll in older Firefox
        if( support == "DOMMouseScroll" ) {
            _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };
    function _addWheelListener( elem, eventName, callback, useCapture ) {
        elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
            !originalEvent && ( originalEvent = window.event );
            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                }
            };
            // calculate deltaY (and deltaX) according to the event
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
            } else {
                event.deltaY = originalEvent.detail;
            }
            // it's time to fire the callback
            return callback( event );
        }, useCapture || false );
    }
})(window,document);


function scroll(evt) {
	var scrollTarget = document.querySelector('.thumbnails');
	if(scrollTarget.scrollWidth > scrollTarget.offsetWidth) {
		var delta = Math.max(-1, Math.min(1, evt.deltaY));
		var scrollItems = document.querySelectorAll('.thumbnails a');
		var scrollStep = scrollItems[1].offsetLeft - scrollItems[0].offsetLeft;
		scrollTarget.scrollLeft += delta*scrollStep;
		evt.preventDefault();
	}
}
addWheelListener(document.querySelector('.thumbnails'), scroll, false);

