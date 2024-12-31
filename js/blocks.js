// UI for program blocks
"use strict";
// globals: document, window, setTimeout, NodeFilter

var SC = window.SC || {};

SC.blocks = (function () {
    // UI for program blocks
    var self = {},
        program = document.getElementById('program'),
        //colors = ['transparent', 'pink', 'skyblue', 'green', 'blue', 'maroon', 'lime', 'orange', 'cyan'];
        colors = ['transparent', '#fff', '#eee', '#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888'];
    self.program = program;
    self.program.dataDepth = 0;
    self.recent = null;

    function button(aParent, aImage) {
        // Create single instruction button
        var b = document.createElement('button');
        b.style.backgroundColor = 'transparent';
        b.style.backgroundImage = 'url(image/' + aImage + '.png)';
        aParent.appendChild(b);
        return b;
    }

    function instruction(aParent, aSimple, aFirstButton) {
        // Create basic div with instruction button and set swiping events
        var div = document.createElement('div'), btn;
        div.dataInst = aFirstButton;
        if (aParent) {
            div.dataDepth = aParent.dataDepth + 1;
        }
        div.style.backgroundColor = colors[div.dataDepth] || 'pink';
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        if (aSimple) {
            div.style.minHeight = '32px';
        } else {
            div.style.paddingBottom = '1ex';
        }
        if (aFirstButton) {
            btn = button(div, aFirstButton);
            // delete
            btn.addEventListener('keydown', function (event) {
                if (event.key === 'Delete') {
                    div.parentElement.removeChild(div);
                    SC.instructions.updateCount();
                }
            });
            // swipe up/down
            if (aFirstButton !== 'run') {
                SC.swipeUp.add(btn, function (aElement, aDir) {
                    console.log('swipe', aDir, 'btn', btn, 'element', aElement, aElement.parentElement.dataDepth);
                    var swiped_data_depth = aElement.parentElement.dataDepth;
                    // swipe down will remove element
                    if (aDir === 'down') {
                        SC.popup(['Remove instruction'], function (a) {
                            if (a === 'Remove instruction') {
                                div.parentElement.removeChild(div);
                                SC.instructions.updateCount();
                                return;
                            }
                        });
                    }
                    // swipe up will replace element
                    if (aDir === 'up') {
                        SC.popupInst(true, function (aNew) {
                            // remove
                            if (aNew === 'Remove instruction') {
                                div.parentElement.removeChild(div);
                                SC.instructions.updateCount();
                                return;
                            }
                            // create new
                            var n = self.add[aNew](div);
                            n.div.dataDepth = swiped_data_depth;
                            n.dataDepth = swiped_data_depth;
                            n.div.style.backgroundColor = colors[n.dataDepth] || 'pink';
                            // insert it after old
                            div.insertAdjacentElement('beforebegin', n.div);
                            // remove old
                            div.parentElement.removeChild(div);
                            SC.instructions.updateCount();
                        });
                    }
                });
            }
        }
        if (aParent) {
            aParent.appendChild(div);
        }
        return { inst: aFirstButton, div: div, button: btn };
    }

    self.inside = function (aParent) {
        // Add block with plus
        var o = instruction(aParent, true, null);
        // inside
        o.inside = document.createElement('div');
        self.recent = o.inside;
        o.inside.dataDepth = aParent.dataDepth;
        o.inside.style.display = 'flex';
        o.inside.style.flexDirection = 'row';
        o.inside.style.backgroundColor = colors[o.inside.dataDepth + 1] || 'yellow';
        o.div.appendChild(o.inside);
        // plus
        o.button = button(aParent, 'plus');
        o.button.style.backgroundColor = colors[o.inside.dataDepth + 1] || 'brown';
        o.button.onclick = function (event) {
            SC.popupInst(false, function (aNew) {
                console.log('plus', aNew);
                self.recent = o.inside;
                self.add[aNew](o.inside);
                if (event.target.scrollIntoViewIfNeeded) {
                    event.target.scrollIntoViewIfNeeded();
                }
            });
        };
        return o;
    };

    // real instructions

    self.add = {};

    self.add.forward = function (aParent) {
        var o = instruction(aParent, true, 'forward');
        o.div.classList.add('inst');
        o.div.classList.add('forward');
        SC.instructions.updateCount();
        return o;
    };

    self.add.backward = function (aParent) {
        var o = instruction(aParent, true, 'backward');
        o.div.classList.add('inst');
        o.div.classList.add('backward');
        SC.instructions.updateCount();
        return o;
    };

    self.add.left = function (aParent) {
        var o = instruction(aParent, true, 'left');
        o.div.classList.add('inst');
        o.div.classList.add('left');
        SC.instructions.updateCount();
        return o;
    };

    self.add.right = function (aParent) {
        var o = instruction(aParent, true, 'right');
        o.div.classList.add('inst');
        o.div.classList.add('right');
        SC.instructions.updateCount();
        return o;
    };

    self.add.canForward = function (aParent) {
        var o = instruction(aParent, false, 'canForward'), yes, els, no;
        o.div.classList.add('inst');
        o.div.classList.add('canForward');
        yes = self.inside(o.div);
        yes.inside.classList.add('part');
        yes.inside.classList.add('yes');
        els = instruction(o.div, true, 'else');
        els.div.style.backgroundColor = 'transparent';
        els.button.style.minWidth = '8px';
        no = self.inside(o.div);
        no.inside.classList.add('part');
        no.inside.classList.add('no');
        SC.instructions.updateCount();
        return { div: o.div, yes: yes, els: els, no: no };
    };

    self.add.canLeft = function (aParent) {
        var o = instruction(aParent, false, 'canLeft'), yes, els, no;
        o.div.classList.add('inst');
        o.div.classList.add('canLeft');
        yes = self.inside(o.div);
        yes.inside.classList.add('part');
        yes.inside.classList.add('yes');
        els = instruction(o.div, true, 'else');
        els.div.style.backgroundColor = 'transparent';
        els.button.style.minWidth = '8px';
        no = self.inside(o.div);
        no.inside.classList.add('part');
        no.inside.classList.add('no');
        SC.instructions.updateCount();
        return { div: o.div, yes: yes, els: els, no: no };
    };

    self.add.canRight = function (aParent) {
        var o = instruction(aParent, false, 'canRight'), yes, els, no;
        o.div.classList.add('inst');
        o.div.classList.add('canRight');
        yes = self.inside(o.div);
        yes.inside.classList.add('part');
        yes.inside.classList.add('yes');
        els = instruction(o.div, true, 'else');
        els.div.style.backgroundColor = 'transparent';
        els.button.style.minWidth = '8px';
        no = self.inside(o.div);
        no.inside.classList.add('part');
        no.inside.classList.add('no');
        SC.instructions.updateCount();
        return { div: o.div, yes: yes, els: els, no: no };
    };

    self.add.pick = function (aParent) {
        var o = instruction(aParent, true, 'pick');
        o.div.classList.add('inst');
        o.div.classList.add('pick');
        SC.instructions.updateCount();
        return o;
    };

    self.add.drop = function (aParent) {
        var o = instruction(aParent, true, 'drop');
        o.div.classList.add('inst');
        o.div.classList.add('drop');
        SC.instructions.updateCount();
        return o;
    };

    self.add.unlock = function (aParent) {
        var o = instruction(aParent, true, 'unlock');
        o.div.classList.add('inst');
        o.div.classList.add('unlock');
        SC.instructions.updateCount();
        return o;
    };

    self.add.root = function (aParent) {
        // Add root instruction (run)
        var o = instruction(aParent, true, 'run');
        o.inside = self.inside(o.div);
        o.div.classList.add('inst');
        o.div.classList.add('root');
        o.button.onclick = function () {
            // Run program
            //SC.sound.play('footsteps');
            SC.levels.replay();
            var p = self.extract();
            if (p.length <= 0) {
                SC.helpEmptyProgram();
            } else {
                SC.program(SC.robot, p, function () {
                    console.log('end of program', SC.finish.done);
                    //SC.sound.stop('footsteps');
                    if (!SC.finish.done) {
                        SC.sound.play('ooh');
                    }
                });
            }
        };
        // move run button to the end?
        //o.button.parentElement.insertAdjacentElement('beforeend', o.button);
        self.root = o;
        return o;
    };

    self.add.repeat = function (aParent) {
        // Repeat inside block given amount of times
        var o = instruction(aParent, false, 'repeat');
        o.div.style.paddingBottom = '1ex';
        o.div.classList.add('inst');
        o.div.classList.add('repeat');
        o.div.setAttribute('dataCount', 5);
        o.button.dataCount = 5;
        o.button.textContent = o.button.dataCount + 'x';
        o.button.style.color = 'blue';
        o.button.addEventListener('click', function () {
            // change repeat count using slider
            SC.slider(1, SC.levels.current.repeat || 200, o.button.dataCount, 1, 0, '2cm', function (v) {
                v = Math.round(v);
                o.button.dataCount = v;
                o.div.setAttribute('dataCount', v);
                console.log('slider', v);
                o.button.textContent = v + 'x';
            });
        });
        // when instruction is added show slider so that user have to choose right away
        o.button.click();
        // inside block
        o.inside = self.inside(o.div);
        o.inside.div.classList.add('part');
        o.inside.div.classList.add('inside');
        SC.instructions.updateCount();
        return o;
    };

    self.addToRecent = function (aInstOrName) {
        // Add instruction to the recently used block
        console.warn('SC.blocks.addToRecent', aInstOrName);
        return self.add[aInstOrName](self.recent);
    };

    self.extract = function () {
        // Extract program from nested html elements
        var c = document.createElement('div'), s, walk, n, e, i;

        // add special ids to program so that we can highlight them later
        e = self.program.getElementsByClassName('inst');
        for (i = 0; i < e.length; i++) {
            e[i].id = 'orig_inst_' + i;
        }

        c.innerHTML = self.program.innerHTML;
        // remove style
        s = [];
        walk = document.createTreeWalker(c, NodeFilter.SHOW_ELEMENT, null, false);
        n = walk.nextNode();
        while (n) {
            n.removeAttribute('style');
            s.push(n);
            n = walk.nextNode();
        }
        // recursive analyzer
        function f(aElement, aProg) {
            var j, o, yes, yesArr, no, noArr;
            //console.log(aElement, '--', aElement.className);
            // complex instructions
            if (aElement.className === 'inst canForward') {
                yes = aElement.getElementsByClassName('part yes')[0];
                yesArr = [];
                no = aElement.getElementsByClassName('part no')[0];
                noArr = [];
                o = {'canForward': f(yes, yesArr), 'else': f(no, noArr), highlight: aElement.id};
                window.cf = aElement;
                aProg.push(o);
                return aProg;
            }
            if (aElement.className === 'inst canLeft') {
                yes = aElement.getElementsByClassName('part yes')[0];
                yesArr = [];
                no = aElement.getElementsByClassName('part no')[0];
                noArr = [];
                o = {'canLeft': f(yes, yesArr), 'else': f(no, noArr), highlight: aElement.id};
                window.cf = aElement;
                aProg.push(o);
                return aProg;
            }
            if (aElement.className === 'inst canRight') {
                yes = aElement.getElementsByClassName('part yes')[0];
                yesArr = [];
                no = aElement.getElementsByClassName('part no')[0];
                noArr = [];
                o = {'canRight': f(yes, yesArr), 'else': f(no, noArr), highlight: aElement.id};
                window.cf = aElement;
                aProg.push(o);
                return aProg;
            }
            if (aElement.className === 'inst repeat') {
                yes = aElement.getElementsByClassName('part inside')[0];
                yesArr = [];
                o = {'repeat': f(yes, yesArr), count: parseInt(aElement.getAttribute('dataCount'), 10), highlight: aElement.id};
                aProg.push(o);
                return aProg;
            }
            // simple instructions
            if (aElement.className === 'inst forward') {
                aProg.push({forward: 1, highlight: aElement.id});
            }
            if (aElement.className === 'inst backward') {
                aProg.push({backward: 1, highlight: aElement.id});
            }
            if (aElement.className === 'inst left') {
                aProg.push({left: 1, highlight: aElement.id});
            }
            if (aElement.className === 'inst right') {
                aProg.push({right: 1, highlight: aElement.id});
            }
            if (aElement.className === 'inst pick') {
                aProg.push({pick: 1, highlight: aElement.id});
            }
            if (aElement.className === 'inst drop') {
                aProg.push({drop: SC.levels.current.drop, highlight: aElement.id});
            }
            if (aElement.className === 'inst unlock') {
                aProg.push({unlock: 1, highlight: aElement.id});
            }
            // children
            for (j = 0; j < aElement.childNodes.length; j++) {
                f(aElement.childNodes[j], aProg);
            }
            return aProg;
        }
        window.q = f(c, []);
        // done
        return window.q; //c;
    };

    self.clear = function () {
        // Clear program
        self.program.textContent = '';
        self.add.root(self.program);
    };

    self.instructionCount = function (aProgram) {
        // Return number of used instructions
        return (JSON.stringify(aProgram).replace(/"count"/g, '').replace(/,"highlight":"orig_inst_[0-9]+"/g, '').match(/"/g) || []).length / 2; // "
    };

    return self;
}());
