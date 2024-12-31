// Detecting level finish
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.finish = (function () {
    // Detecting level finish
    var self = {};
    self.targets = {};
    self.items = {};
    self.zbuffer = {};
    self.steps = 0;

    function check() {
        // Check if all targets were reached
        var xy, t;
        for (xy in self.targets) {
            if (self.targets.hasOwnProperty(xy)) {
                if (!self.targets[xy]) {
                    //console.warn('need to reach', xy);
                    return;
                }
            }
        }
        // check if all items were collected
        for (t in self.items) {
            if (self.items.hasOwnProperty(t)) {
                if (self.items[t].has < self.items[t].need) {
                    //console.warn('has only ', self.items[t].has, '/', self.items[t].need, 'of', t);
                    return;
                }
            }
        }
        // was everywhere and has everything
        SC.cmdBreak = true;
        SC.robot.onWalk = null;
        SC.robot.onStopWalkPath = null;
        //SC.sound.stop('footsteps');
        self.done = true;
        // show complete screen
        setTimeout(function () {
            // calculate stars
            var prog = SC.blocks.extract(),
                inst = SC.blocks.instructionCount(prog),
                steps = self.steps,
                stars = 1;
            if (inst <= SC.levels.current.medium.instructions && steps <= SC.levels.current.medium.steps) {
                stars = 2;
            }
            if (inst <= SC.levels.current.best.instructions && steps <= SC.levels.current.best.steps) {
                stars = 3;
            }
            // show end
            SC.complete(stars, inst, steps, prog);
        }, 500);
    }

    self.reset = function (aCharacter) {
        // Reset tracked variables and handle onWalk event
        SC.cmdBreak = false;
        self.done = false;
        self.steps = 0;
        self.items = {};
        self.targets = {};
        self.zbuffer = {};
        self.zbuffer[aCharacter.x + ' ' + aCharacter.y] = 1;
        aCharacter.onWalk = function (c) {
            self.steps++;
            var xy = c.x + ' ' + c.y;
            //console.log('ow', xy);
            if (self.targets.hasOwnProperty(xy)) {
                self.targets[xy] = true;
                check();
            }
            if (!self.zbuffer.hasOwnProperty(xy)) {
                self.zbuffer[xy] = 0;
            }
            self.zbuffer[xy]++;
        };
    };

    self.target = function (x, y) {
        // Add point to target
        self.targets[x + ' ' + y] = false;
    };

    self.item = function (aTile, aAmount) {
        // Define new item requirements
        self.items[aTile] = { need: aAmount, has: 0 };
    };

    self.pick = function (aTile) {
        // Check after item is picked
        if (!self.items.hasOwnProperty(aTile)) {
            self.items[aTile] = { need: 0, has: 0 };
        }
        self.items[aTile].has++;
        SC.sound.play('pop');
        check();
    };

    self.drop = function (aTile) {
        // Check after item is dropped
        if (!self.items.hasOwnProperty('drop_' + aTile)) {
            self.items['drop_' + aTile] = { need: 0, has: 0 };
        }
        self.items['drop_' + aTile].has++;
        SC.sound.play('pop');
        check();
    };

    return self;
}());

