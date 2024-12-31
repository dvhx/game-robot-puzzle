// Simplified programs (simple imutable 1D array of instructions, original SC.command uses stacker which dissapear as program progress which makes loops very difficult)
"use strict";
// globals: document, window, SC, setTimeout

var SC = window.SC || {};

SC.inst = {};

SC.highlightInst = function (aId) {
    // highlight currently executed instruction
    var i, elements = document.getElementsByClassName('inst'), e;
    for (i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = elements[i].dataBgWas || elements[i].style.backgroundColor;
    }
    e = document.getElementById(aId);
    e.dataBgWas = e ? e.style.backgroundColor : '';
    e.style.backgroundColor = 'lime';
};

SC.inst.forward = function (aCharacter, aCallback, aProgram) {
    // Walk 1 step forward
    SC.highlightInst(aProgram.cur.highlight);
    aCharacter.walkPath('F', aCallback);
};

SC.inst.left = function (aCharacter, aCallback, aProgram) {
    // Turn righ
    SC.highlightInst(aProgram.cur.highlight);
    aCharacter.walkPath('<p', aCallback);
};

SC.inst.right = function (aCharacter, aCallback, aProgram) {
    // Turn left
    SC.highlightInst(aProgram.cur.highlight);
    aCharacter.walkPath('>p', aCallback);
};

SC.inst.repeat = function (aCharacter, aCallback, aProgram) {
    // Repeat subprogram given amount of times {repeat: [subprogram], count: 3}
    var count = aProgram.cur.count,
        code = aProgram.cur.repeat;
    SC.highlightInst(aProgram.cur.highlight);
    function f() {
        SC.program(aCharacter, code, function () {
            count--;
            if (count > 0) {
                f();
            } else {
                aCallback();
            }
        });
    }
    f();
};

SC.inst.pick = function (aCharacter, aCallback, aProgram) {
    // Pick topmost pickable tile
    var tiles = SC.maps[aCharacter.map].ground[aCharacter.y][aCharacter.x],
        i,
        tile = '';
    SC.highlightInst(aProgram.cur.highlight);
    // find topmost pickable tile
    for (i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] === 'drop') {
            tile = tiles[i + 1];
        }
    }
    console.log('pick', tile);
    // pick
    if (aCharacter.pick(tile)) {
        // pick successfull
        SC.finish.pick(tile);
        if (aProgram.cur.success) {
            SC.program(aCharacter, aProgram.cur.success, aCallback);
        } else {
            aCallback();
        }
    } else {
        // pick failed
        if (aProgram.cur.fail) {
            SC.program(aCharacter, aProgram.cur.fail, aCallback);
        } else {
            aCallback();
        }
    }
};

SC.inst.drop = function (aCharacter, aCallback, aProgram) {
    // Drop tile
    SC.highlightInst(aProgram.cur.highlight);
    var tiles = SC.maps[aCharacter.map].ground[aCharacter.y][aCharacter.x],
        tile = aProgram.cur.drop;
    //console.log('drop', tile, tiles);
    if (tiles.indexOf(tile) < 0) {
        SC.finish.drop(tile);
        tiles.push('drop');
        tiles.push(tile);
        SC.map.change(aCharacter.map, aCharacter.x, aCharacter.y, tiles);
    }
    setTimeout(aCallback, 100);
};

SC.inst.unlock = function (aCharacter, aCallback, aProgram) {
    // Unlock doors in front of me
    SC.highlightInst(aProgram.cur.highlight);
    var fp = SC.coordsForward(),
        o = SC.open(fp.x, fp.y, function () {
            console.log('unlocked');
            aCallback();
        });
    if (o !== 'door' && o !== 'bars') {
        SC.program(aCharacter, aProgram.cur.fail || [], aCallback);
    }
};

SC.inst.explore = function (aCharacter, aCallback, aProgram) {
    // Go to nearest walkable cell with lowest zbuffer
    SC.highlightInst(aProgram.cur.highlight);
    var LEFT = 1, RIGHT = 2, UP = 4, DOWN = 8,
        x = SC.robot.x,
        y = SC.robot.y,
        xyLeft = (x - 1) + ' ' + y,
        xyRight = (x + 1) + ' ' + y,
        xyUp = x + ' ' + (y - 1),
        xyDown = x + ' ' + (y + 1),
        e = SC.maps[SC.robot.map].edge[y][x],
        canLeft = (x > 0) && ((e & LEFT) === 0),
        canRight = (x < SC.maps[SC.robot.map].width - 1) && ((e & RIGHT) === 0),
        canUp = (y > 0) && ((e & UP) === 0),
        canDown = (x < SC.maps[SC.robot.map].height - 1) && ((e & DOWN) === 0),
        zLeft = SC.finish.zbuffer[xyLeft] || 0,
        zRight = SC.finish.zbuffer[xyRight] || 0,
        zUp = SC.finish.zbuffer[xyUp] || 0,
        zDown = SC.finish.zbuffer[xyDown] || 0,
        a = [];
    a.push({can: canLeft, z: zLeft, p: 'lL'});
    a.push({can: canRight, z: zRight, p: 'rR'});
    a.push({can: canUp, z: zUp, p: 'uU'});
    a.push({can: canDown, z: zDown, p: 'dD'});
    a.sort(function (a, b) {
        // prefer walkable
        if (a.can && !b.can) {
            return -1;
        }
        if (!a.can && b.can) {
            return 1;
        }
        // prefer low z
        if (a.z === b.z) {
            return 0;
        }
        if (a.z < b.z) {
            return -1;
        }
        return 1;
    });
    if (a[0].can) {
        aCharacter.walkPath(a[0].p, function () {
            aCallback();
        });
    }
};

SC.inst.canForward = function (aCharacter, aCallback, aProgram) {
    // Run code if can walk forward {canForward: code, else: code2}
    SC.highlightInst(aProgram.cur.highlight);
    if (SC.canForward()) {
        SC.program(aCharacter, aProgram.cur.canForward, function () {
            aCallback();
        });
    } else {
        SC.program(aCharacter, aProgram.cur['else'] || [], function () {
            aCallback();
        });
    }
};

SC.inst.canRight = function (aCharacter, aCallback, aProgram) {
    // Run code if can walk righthand {canRight: code, else: code2}
    SC.highlightInst(aProgram.cur.highlight);
    if (SC.canRight()) {
        SC.program(aCharacter, aProgram.cur.canRight, function () {
            aCallback();
        });
    } else {
        SC.program(aCharacter, aProgram.cur['else'] || [], function () {
            aCallback();
        });
    }
};

SC.inst.canLeft = function (aCharacter, aCallback, aProgram) {
    // Run code if can walk lefthand {canLeft: code, else: code2}
    SC.highlightInst(aProgram.cur.highlight);
    if (SC.canLeft()) {
        SC.program(aCharacter, aProgram.cur.canLeft, function () {
            aCallback();
        });
    } else {
        SC.program(aCharacter, aProgram.cur['else'] || [], function () {
            aCallback();
        });
    }
};

SC.program = function (aCharacter, aCode, aDone) {
    // Execute program on given character, call aDone callback when program ends
    var self = {};
    self.code = aCode;
    self.pc = 0;
    self.cur = null;

    self.step = function () {
        // Execute single instruction
        if (self.pc >= self.code.length) {
            aDone(aCharacter);
            return false;
        }
        var cur = self.code[self.pc],
            k = typeof cur === 'string' ? cur : Object.keys(cur)[0];
        self.cur = cur;
        //console.log('step', k, cur);
        //console.log('current', self.pc, self.code[self.pc]);

        //SC.blocks.program.getElementsByClassName('inst')[self.pc + 1].style.backgroundColor = 'green';

        if (!SC.inst.hasOwnProperty(k)) {
            console.warn('SC.inst has no instruction ' + k);
        }
        SC.inst[k](aCharacter, function () {
            self.pc++;
            self.step();
        }, self);
        return true;
    };
    self.step();

    return self;
};

// SC.program(SC.robot, ['forward', 'forward', 'forward', 'left', 'forward'], console.warn);
// SC.program(SC.robot, [{repeat: ['forward'], count: 3}, 'left', 'forward'], console.warn);
