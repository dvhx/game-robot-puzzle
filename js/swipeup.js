// Removing elements by swiping them up/down from their original position
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.swipeUp = (function () {
    // Removing elements by swiping them up/down from their original position
    var self = {}, x0, y0, dy, dx, h;

    function onTouchStart(event) {
        //console.log('SC.swipeUp.onTouchStart', event);
        y0 = event.targetTouches[0].clientY;
        x0 = event.targetTouches[0].clientX;
        dy = 0;
        dx = 0;
        h = event.target.clientHeight;
        event.target.style.position = 'relative';
    }

    function onTouchMove(event) {
        //console.log('SC.swipeUp.onTouchMove', event);
        var x = event.targetTouches[0].clientX,
            y = event.targetTouches[0].clientY;
        dx = x - x0;
        dy = y - y0;
        if (Math.abs(dx) > 1.5 * h) {
            dy = 0;
        }
        event.target.style.top = dy + 'px';
    }

    function onTouchEnd(event) {
        //console.log('SC.swipeUp.onTouchEnd', event);
        var h2 = event.target.clientHeight / 2;
        event.target.style.top = '0';
        if (dy > h2) {
            event.target.dataSwipeUp(event.target, 'down');
        }
        if (dy < -h2) {
            event.target.dataSwipeUp(event.target, 'up');
        }
    }

    function onMouseDown(event) {
        //console.log('RR.swipeUp.onMouseDown', event);
        if (event.buttons & 1) {
            onTouchStart({target: event.target, targetTouches: [{clientX: event.clientX, clientY: event.clientY}]});
        }
    }

    function onMouseMove(event) {
        //console.log('RR.swipeUp.onMouseMove', event);
        if (event.buttons & 1) {
            onTouchMove({target: event.target, targetTouches: [{clientX: event.clientX, clientY: event.clientY}]});
            if (dy > 5) {
                event.target.dataSwipeUp(event.target, 'down');
                event.target.style.top = '0';
            }
            if (dy < -5) {
                event.target.dataSwipeUp(event.target, 'up');
                event.target.style.top = '0';
            }
        }
    }

    function onMouseUp(event) {
        event.target.style.top = '0';
    /*
        if (dy > 2) {
            event.target.dataSwipeUp(event.target, 'down');
        }
        if (dy < -2) {
            event.target.dataSwipeUp(event.target, 'up');
        }*/
        //if (event.which === 1) {
        //onTouchEnd({target: event.target, targetTouches: [{clientX: event.clientX, clientY: event.clientY}]});
        //}
    }

    self.add = function (aElement, aCallback) {
        // Make element swipeable
        aElement.addEventListener('touchstart', onTouchStart, true);
        aElement.addEventListener('touchmove', onTouchMove, true);
        aElement.addEventListener('touchend', onTouchEnd, true);
        aElement.addEventListener('mousedown', onMouseDown, true);
        aElement.addEventListener('mousemove', onMouseMove, true);
        aElement.addEventListener('mouseup', onMouseUp, true);
        aElement.dataSwipeUp = aCallback;
    };

    return self;
}());

SC.swipeHorizontally = (function () {
    var self = {}, x0, dx;

    function onTouchStart(event) {
        //console.log('touch start', event);
        x0 = event.targetTouches[0].clientX;
        dx = 0;
        event.target.style.position = 'relative';
    }

    function onTouchMove(event) {
        //console.log('touch move', event);
        var x = event.targetTouches[0].clientX;
        dx = x - x0;
        event.target.style.left = dx + 'px';
    }

    function onTouchEnd(event) {
        //console.log('touch end', dx);
        var w = event.target.clientWidth / 2;
        event.target.style.left = '0';
        if (dx > w) {
            event.target.dataSwipeUp(event.target, 'right');
        }
        if (dx < -w) {
            event.target.dataSwipeUp(event.target, 'left');
        }
        //event.target.style.position = 'initial';
    }

    self.add = function (aElement, aCallback) {
        // Make element swipeable
        aElement.addEventListener('touchstart', onTouchStart, true);
        aElement.addEventListener('touchmove', onTouchMove, true);
        aElement.addEventListener('touchend', onTouchEnd, true);
        aElement.dataSwipeUp = aCallback;
    };

    return self;
}());

