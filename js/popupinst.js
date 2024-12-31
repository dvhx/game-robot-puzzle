// Popup menu with instructions to choose from (insert, replace)
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.popupInst = function (aRemoveInst, aCallback) {
    // Popup menu with instructions to choose from (insert, replace)
    var self = {}, k, names = [], p;

    // Conversion table for translating machine instruction names to human readable names
    self.instMachineToHuman = {
        "forward": "Forward",
        "backward": "Backward",
        "left": "Turn left",
        "right": "Turn right",
        "pick": "Pick",
        "drop": "Drop",
        "repeat": "Repeat",
        "canForward": "Can forward",
        "canLeft": "Can left",
        "canRight": "Can right",
        "unlock": "Unlock"
    };

    // Reverse conversion table for translating human readable names to machine instruction names
    self.instHumanToMachine = (function () {
        var m, o = {};
        for (m in self.instMachineToHuman) {
            if (self.instMachineToHuman.hasOwnProperty(m)) {
                o[self.instMachineToHuman[m]] = m;
            }
        }
        return o;
    }());

    // show popup
    SC.instructions.updateCount();
    for (k in SC.levels.currentInstructions) {
        if (SC.levels.currentInstructions.hasOwnProperty(k)) {
            if (k === 'help') {
                continue;
            }
            if (k === 'clear') {
                continue;
            }
            if (SC.levels.currentInstructionsRemaining[k] > 0) {
                names.push(self.instMachineToHuman[k] + ' (' + (SC.levels.currentInstructionsTotal[k] - SC.levels.currentInstructionsRemaining[k]) + '/' + SC.levels.currentInstructionsTotal[k] + ')');
            }
        }
    }
    names.sort();
    if (aRemoveInst) {
        names.push('Remove instruction');
    }
    p = SC.popup(names, function (a) {
        // remove instruction
        if (a === 'Remove instruction') {
            aCallback(a);
            return;
        }
        // replace instruction
        var inst = a.split('(')[0].trim();
        aCallback(self.instHumanToMachine[inst]);
    });
    p.style.maxHeight = 'calc(100vh - 2cm)';
    p.style.overflowY = 'scroll';
};

