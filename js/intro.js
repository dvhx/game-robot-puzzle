// Show short intro before each level
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.intro = function (aMap) {
    // Show short intro before each level
    console.log('SC.intro', aMap);
    // intro will only be shown 3 times
    var intro = document.getElementById('intro'),
        title = document.getElementById('intro_title'),
        obj = document.getElementById('intro_objective');
    title.textContent = 'Level ' + SC.levels.levels[aMap].index;
    obj.textContent = SC.levels.levels[aMap].info;
    intro.style.display = 'flex';

    function hide() {
        intro.style.display = 'none';
    }

    intro.onclick = hide;
};
