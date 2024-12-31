// Main window
"use strict";
// globals: document, window, setInterval, setTimeout

var SC = window.SC || {};

// duplicate tiles for single tile characters
SC.characters.singleTileCharacter('invisible');

function purge() {
    // Erase storage and reload app (debugging)
    SC.storage.eraseAll();
    document.location.reload();
}

function skip() {
    // Skip current level (debugging)
    var k;
    for (k in SC.finish.items) {
        if (SC.finish.items.hasOwnProperty(k)) {
            SC.finish.items[k].has = 999;
        }
    }
    SC.finish.targets = {};
    SC.finish.drop('apple');
}

SC.customLoop = function () {
    // Custom rendering loop
    if (SC.background.map) {
        SC.render();
    }
    // loop itself
    window.requestAnimationFrame(SC.customLoop);
};

SC.fullZoom = function () {
    // Scale map to full screen with camera in center
    if (SC.background.map) {
        var v = SC.canvas.bg.clientWidth / SC.maps[SC.background.map].width / 16,
            h = SC.canvas.bg.clientHeight / SC.maps[SC.background.map].height / 16;
        //console.log(v, h);
        SC.camera.rx = SC.maps[SC.background.map].width / 2 - (SC.maps[SC.background.map].width % 2 === 1 ? 0.5 : 0);
        SC.camera.ry = SC.maps[SC.background.map].height / 2 - (SC.maps[SC.background.map].height % 2 === 1 ? 0.5 : 0);
        SC.camera.teleport(SC.background.map, SC.camera.rx, SC.camera.ry);
        SC.canvas.setZoom(Math.min(v, h));
    }
};

// initialize window
window.addEventListener('DOMContentLoaded', function () {
    try {
        // sounds
        SC.sound.add('click', 3);
        SC.sound.add('count', 3);
        SC.sound.add('ooh', 3);
        SC.sound.add('pop', 3);
        SC.sound.add('win', 3);
        //SC.sound.add('footsteps', 2, true);

        // init
        SC.init(function () {
            // initialize canvas
            SC.canvas.init('background_canvas', 'character_canvas');
            SC.background.autoclear = true;

            // initialize on-screen touchpad but hide it
            SC.touchpad = SC.touchpad('image/arrows130.png', undefined, true);
            SC.touchpad.img.style.zIndex = 10;
            SC.touchpad.hide();

            // rendering loop
            SC.customLoop();

            // full zoom after rotate
            window.addEventListener('resize', SC.fullZoom);
        });
    } catch (e) {
        alert(e);
    }
});

