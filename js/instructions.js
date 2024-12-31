// UI for available instructions and related code
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.instructions = (function () {
    // UI for available instructions and related code
    var self = {};

    function onClick(event) {
        // Click on single instruction will add it to recent block
        var inst = event.target.dataInst,
            block;
        block = SC.blocks.addToRecent(inst);
        if (block && block.button) {
            if (block.button.scrollIntoViewIfNeeded) {
                block.button.scrollIntoViewIfNeeded();
            }
        }
        self.updateCount();
    }

    function onClickHelp() {
        // Click on help will show current level help
        SC.help(SC.levels.map);
    }

    function onClickClear() {
        // Click on clear will restore player position and map (but not code)
        SC.levels.replay();
    }

    function button(aInst, aCount) {
        // Add single button
        var btn, span;
        btn = document.createElement('button');
        btn.id = 'inst_' + aInst;
        btn.className = 'srcinst ' + aInst;
        btn.dataInst = aInst;
        if (aInst === 'help') {
            btn.onclick = onClickHelp;
        } else if (aInst === 'clear') {
            btn.onclick = onClickClear;
        } else {
            span = document.createElement('span');
            span.id = 'inst_span_' + aInst;
            span.textContent = aCount; // + 'x';
            span.className = "count";
            span.dataInst = aInst;
            btn.appendChild(span);
            btn.onclick = onClick;
        }
        document.getElementById('instructions').appendChild(btn);
        return btn;
    }

    self.add = function (aInstructions) {
        // Add available instructions to the top left of the screen, show number of available
        console.log('SC.instructions.add', aInstructions);
        var i;
        aInstructions.help = 1;
        aInstructions.clear = 1;
        document.getElementById('instructions').innerText = '';
        for (i in aInstructions) {
            if (aInstructions.hasOwnProperty(i)) {
                button(i, aInstructions[i]);
            }
        }
    };

    self.updateCount = function () {
        // update instructions count by analyzing program (this is better than incrementing/decrementing remaining instructions because if user remove repeat block it still counts correctly)
        var p = JSON.stringify(SC.blocks.extract()),
            inst = SC.levels.currentInstructions,
            i,
            re,
            c,
            r,
            btn,
            span;
        for (i in inst) {
            if (inst.hasOwnProperty(i)) {
                // count the occurances
                c = 0;
                re = new RegExp('"' + i + '"', 'g');
                while (re.exec(p)) {
                    c++;
                }
                // count remaining
                r = inst[i] - c;
                SC.levels.currentInstructionsRemaining[i] = r;
                // update button
                btn = document.getElementById('inst_' + i);
                if (btn) {
                    btn.style.display = r > 0 ? 'inline-block' : 'none';
                }
                // update span
                span = document.getElementById('inst_span_' + i);
                if (span) {
                    span.textContent = r;
                }
            }
        }
    };

    return self;
}());
