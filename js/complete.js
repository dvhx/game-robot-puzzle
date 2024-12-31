// Show level complete
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.complete = function (aStars, aInstructions, aSteps, aProgram) {
    // Show level complete
    var complete, stars, instructions, steps, replay, next, menu;
    complete = document.getElementById('complete');
    stars = complete.getElementsByClassName('stars')[0];
    instructions = complete.getElementsByClassName('instructions')[0];
    steps = complete.getElementsByClassName('steps')[0];
    replay = complete.getElementsByClassName('replay')[0];
    next = complete.getElementsByClassName('next')[0];
    menu = complete.getElementsByClassName('menubutton')[0];

    switch (aStars) {
    case 0:
        stars.innerHTML = '<span style="opacity: 0.3;">⭐⭐⭐</span>';
        break;
    case 1:
        stars.innerHTML = '⭐<span style="opacity: 0.3;">⭐⭐</span>';
        break;
    case 2:
        stars.innerHTML = '⭐⭐<span style="opacity: 0.3;">⭐</span>';
        break;
    case 3:
        stars.innerHTML = '⭐⭐⭐';
        break;
    }
    instructions.textContent = aInstructions;
    steps.textContent = aSteps;

    function hide() {
        complete.style.display = 'none';
        SC.blocks.clear();
        SC.map.restoreOriginal(SC.levels.map);
    }

    replay.onclick = function () {
        hide();
        SC.levels.replay();
    };
    next.onclick = function () {
        hide();
        SC.map.restoreOriginal(SC.levels.map);
        SC.levels.next();
    };
    menu.onclick = function () {
        hide();
        SC.levels.show();
    };

    complete.style.display = 'flex';

    SC.sound.play('win');
};

