// Show level help on a button
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.help = function (aMap) {
    // Show level help on a button
    var l = SC.levels.levels[aMap];

    function text(aId, aText) {
        // Show text in element
        document.getElementById(aId).textContent = aText;
    }

    function hide() {
        // Hide help
        document.getElementById('help').style.display = 'none';
    }

    function play() {
        // Play current level
        hide();
        SC.levels.start(aMap);
    }

    function menu() {
        // Show main menu with levels
        hide();
        SC.blocks.clear();
        SC.levels.show();
    }

    text('help_title', 'Level ' + l.index);
    text('help_subtitle', l.objective);
    document.getElementById('help_thumbnail').src = 'map/' + aMap + '.png';
    text('help_info', 'Objective: ' + l.info);
    text('help_bi', l.best.instructions);
    text('help_bs', l.best.steps);
    text('help_mi', l.medium.instructions);
    text('help_ms', l.medium.steps);

    document.getElementById('help_play1').onclick = play;
    document.getElementById('help_play2').onclick = play;
    document.getElementById('help_menu1').onclick = menu;
    document.getElementById('help_menu2').onclick = menu;

    function show(aInst) {
        document.getElementById('help_inst_' + aInst).style.display = l.instructions.hasOwnProperty(aInst) ? 'table-row' : 'none';
    }

    show("forward");
    show("left");
    show("right");
    show("pick");
    show("drop");
    show("unlock");
    show("repeat");
    show("canForward");
    show("canLeft");
    show("canRight");

    document.getElementById('help').style.display = 'block';
    document.getElementById('help').scrollTo(0, 0);
};

SC.helpEmptyProgram = function () {
    // Show help for empty program
    var e = document.getElementById('help_empty_program');
    e.style.display = 'block';
    e.onclick = function () {
        e.style.display = 'none';
    };
};

