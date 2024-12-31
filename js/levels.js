// Managing levels
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.levels = (function () {
    // Managing levels
    var self = {};
    self.map = 'library_get_key';

    self.levels = {
        library_get_key: {
            index: 1,
            objective: "Key to library",
            info: "Find a key to the library by stepping directly on it and then pick it up.",
            items: {key: 1},
            instructions: {forward: 10, left: 10, right: 10, pick: 10},
            repeat: 20,
            best: {instructions: 8, steps: 5},
            medium: {instructions: 10, steps: 7}
        },
        library_open_bars: {
            index: 2,
            objective: "Unlock library",
            info: "Walk to bars, face them and unlock them. Then walk forward to enter the library.",
            items: {},
            instructions: {forward: 10, left: 10, right: 10, unlock: 10},
            repeat: 20,
            best: {instructions: 10, steps: 6},
            medium: {instructions: 12, steps: 8}
        },
        library_find_book: {
            index: 3,
            objective: "Pick books",
            info: "Someone made a mess in the library. Pick all books from the ground.",
            items: {booksmall: 12},
            instructions: {forward: 30, left: 30, right: 30, repeat: 10, pick: 30},
            repeat: 20,
            best: {instructions: 10, steps: 21},
            medium: {instructions: 20, steps: 30}
        },
        apples_pick: {
            index: 4,
            objective: "Pick apples",
            info: "Eight apples fell from the apple tree. Pick them all up. This time you don't have enough Forward instructions so you must use repeat command.",
            items: {apple: 8},
            instructions: {forward: 10, left: 10, repeat: 5, pick: 30},
            repeat: 20,
            best: {instructions: 12, steps: 21},
            medium: {instructions: 15, steps: 30}
        },
        apples_poop: {
            index: 5,
            objective: "Plant trees",
            info: "Plant 20 trees in your orchard. You can only plant one tree on the spot.",
            items: {drop_tree1: 20},
            drop: "tree1",
            instructions: {forward: 10, left: 10, right: 10, repeat: 10, drop: 30},
            repeat: 100,
            best: {instructions: 6, steps: 20},
            medium: {instructions: 10, steps: 30}
        },
        maze_small: {
            index: 6,
            objective: "Solve maze",
            info: "Walk to the end of the maze and find treasure chest.",
            items: {},
            instructions: {forward: 30, left: 30, right: 30, repeat: 5, canLeft: 5, canRight: 5, canForward: 5},
            repeat: 100,
            best: {instructions: 9, steps: 24},
            medium: {instructions: 12, steps: 28}
        },
        maze_big: {
            index: 7,
            objective: "Big maze",
            info: "Walk to the end of the big maze. You don't have enough instructions so you must be creative. But it can be done!",
            items: {},
            instructions: {forward: 5, left: 5, right: 5, repeat: 5, canLeft: 5, canRight: 5, canForward: 5},
            repeat: 300,
            best: {instructions: 9, steps: 122},
            medium: {instructions: 20, steps: 150}
        },
        forrest: {
            // [{R:[{cF:[F,{"drop":"tree1"}],e:[{cR:[R],e:[L]}]}],c:300}]
            index: 8,
            objective: "Forrest",
            info: "Plant at least 76 trees!",
            items: {drop_tree1: 76},
            instructions: {forward: 10, left: 10, right: 10, repeat: 10, canLeft: 10, canRight: 10, canForward: 10, drop: 10},
            repeat: 300,
            drop: "tree1",
            best: {instructions: 7, steps: 75},
            medium: {instructions: 40, steps: 200}
        },
        deep_forrest: {
            // r9f l r8f l r18(r17(df)dlfdl r18(df)rfdr)
            index: 9,
            objective: "Deep forrest",
            info: "Cover entire area with trees, that is plant 324 trees!",
            items: {drop_tree1: 324},
            instructions: {forward: 10, left: 10, right: 10, repeat: 10, canLeft: 10, canRight: 10, canForward: 10, drop: 10},
            repeat: 324,
            drop: "tree1",
            best: {instructions: 24, steps: 340},
            medium: {instructions: 40, steps: 500}
        },
        impossible: {
            index: 10,
            objective: "Lost in woods",
            info: "Pick all 8 apples. This level is extra hard!",
            items: {apple: 8},
            instructions: {forward: 10, left: 10, right: 10, repeat: 10, canLeft: 10, canRight: 10, canForward: 10, pick: 10},
            repeat: 30,
            drop: "tree1",
            best: {instructions: 93, steps: 44},
            medium: {instructions: 150, steps: 100}
        }
    };
    self.current = self.levels[self.map];
    self.stars = SC.storage.readObject('SC.levels.stars', {library_get_key: 0});

    self.updateStars = function (aStars) {
        // Update number of received stars for level and save it
        self.stars[self.map] = aStars;
        SC.storage.writeObject('SC.levels.stars', self.stars);
    };

    self.start = function (aMap) {
        // Initialize level
        console.log('SC.levels.start', aMap);
        self.map = aMap;
        var lvl = self.levels[aMap], t;
        self.current = lvl;
        self.currentInstructions = JSON.parse(JSON.stringify(lvl.instructions));
        self.currentInstructionsRemaining = JSON.parse(JSON.stringify(lvl.instructions));
        self.currentInstructionsTotal = JSON.parse(JSON.stringify(lvl.instructions));
        // characters
        SC.characters.clear();
        SC.robot = SC.map.npc(aMap, 'player');
        SC.robot.wallCauseOnWalk = true;
        SC.finish.reset(SC.robot);
        // set map required target
        t = SC.places.byName[aMap + " target"];
        if (t) {
            SC.finish.target(t.x, t.y);
        }
        // set map required items
        if (lvl.items) {
            for (t in lvl.items) {
                if (lvl.items.hasOwnProperty(t)) {
                    console.log(t, lvl.items[t]);
                    SC.finish.item(t, lvl.items[t]);
                }
            }
        }
        // add instructions on top
        if (lvl.instructions) {
            SC.instructions.add(lvl.instructions);
        }
        // set camera
        SC.camera = SC.character('camera', aMap, 0, 0, 'invisible');
        SC.camera.setPlayer();
        SC.camera.frozen = true;
        // background
        SC.background.load(aMap);
        SC.fullZoom();
        SC.instructions.updateCount();
    };
    SC.blocks.add.root(SC.blocks.program);

    self.replay = function () {
        // Replay level
        self.start(self.map);
        SC.map.restoreOriginal(self.map);
    };

    self.next = function () {
        // Load next level
        var k, n = self.map;
        for (k in self.levels) {
            if (self.levels.hasOwnProperty(k)) {
                //console.log('next', self.levels[k].index, self.current.index);
                if (self.levels[k].index === self.current.index + 1) {
                    n = k;
                }
            }
        }
        //console.log('n', n);
        SC.intro(n);
        self.start(n);
        SC.map.restoreOriginal(n);
    };

    self.show = function () {
        // Show main screen with levels
        SC.levelsScreen('Robot puzzle', 'image/level.png', 'image/level.png', 'image/krivan.jpg', self.levels, self.stars, function (aMap) {
            SC.intro(aMap);
            self.start(aMap);
        });
    };
    self.show();

    return self;
}());

