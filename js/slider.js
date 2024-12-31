// Slider for setting number of repeats
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.slider = function (aMin, aMax, aValue, aStep, aDigits, aBottomPosition, aCallback) {
    // Slider for setting number of repeats
    var self = {}, bg, div, left, middle, dot, right, tx;

    function val(d) {
        // Update value
        aValue += d;
        if (aValue < aMin) {
            aValue = aMin;
        }
        if (aValue > aMax) {
            aValue = aMax;
        }
        dot.style.left = ((aValue - aMin) / (aMax - aMin)) * (middle.clientWidth - dot.clientWidth) + 'px';
        dot.textContent = aValue.toFixed(aDigits || 0);
    }
    self.update = val;

    // bg
    bg = document.createElement('div');
    bg.className = 'sliderbg';
    bg.addEventListener('click', function () {
        bg.parentElement.removeChild(bg);
        div.parentElement.removeChild(div);
        aCallback(aValue);
    });
    document.body.appendChild(bg);

    // div
    div = document.createElement('div');
    div.className = 'slider';
    div.style.bottom = aBottomPosition || '50vh';
    // left
    left = document.createElement('div');
    left.className = 'left';
    left.addEventListener('click', function () {
        val(-aStep);
    });
    div.appendChild(left);
    // middle
    middle = document.createElement('div');
    middle.className = 'middle';
    div.appendChild(middle);
    // dot
    dot = document.createElement('div');
    dot.className = 'dot';
    dot.textContent = aValue;
    middle.appendChild(dot);
    dot.addEventListener('touchstart', function (event) {
        tx = event.targetTouches[0].clientX;
    });
    dot.addEventListener('touchmove', function (event) {
        var x = event.targetTouches[0].clientX;
        val((x - tx) * (aMax - aMin) / (middle.clientWidth - dot.clientWidth));
        tx = x;
    });
    // mouse support
    div.addEventListener('mousedown', function (event) {
        if (event.which === 1) {
            tx = event.clientX;
            val(0);
        }
    });
    div.addEventListener('mousemove', function (event) {
        if (event.buttons & 1) {
            var x = event.clientX;
            val((x - tx) * (aMax - aMin) / (middle.clientWidth - dot.clientWidth));
            tx = x;
        }
    });
    // right
    right = document.createElement('div');
    right.className = 'right';
    right.addEventListener('click', function () {
        val(aStep);
    });
    div.appendChild(right);

    document.body.appendChild(div);

    val(0);
    return self;
};

