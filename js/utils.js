// Various functions
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.coordsForward = function () {
    // Return coordinates of cell in front of robot
    switch (SC.robot.dir) {
    case "left":
        return {x: SC.robot.x - 1, y: SC.robot.y};
    case "right":
        return {x: SC.robot.x + 1, y: SC.robot.y};
    case "up":
        return {x: SC.robot.x, y: SC.robot.y - 1};
    case "down":
    case "dead":
    case "sleep":
        return {x: SC.robot.x, y: SC.robot.y + 1};
    }
};

SC.dir = function (aX1, aY1, aX2, aY2) {
    // Return direction from [aX1,aY1] to [aX2,aY2] point, e.g. dir(10, 10, 10, 9) returns "up"
    var dx = aX2 - aX1,
        dy = aY2 - aY1;
    if (dx > 0) {
        return 'right';
    }
    if (dx < 0) {
        return 'left';
    }
    if (dy > 0) {
        return 'down';
    }
    if (dy < 0) {
        return 'up';
    }
};

SC.open = function (aX, aY, aCallback) {
    // Animate opening of doors or bars at given coordinates, then call the callback
    if (aX < 0 || aY < 0 || aX >= SC.maps[SC.robot.map].width || aY >= SC.maps[SC.robot.map].height) {
        return;
    }
    var g = SC.maps[SC.robot.map].ground[aY][aX],
        t,
        base,
        dir;
    if (g.indexOf('bars1') >= 0) {
        base = 'bars';
        g.splice(g.indexOf('bars1'), 1);
    }
    if (g.indexOf('door1') >= 0) {
        base = 'door';
        g.splice(g.indexOf('door1'), 1);
    }
    if (!base) {
        return;
    }
    setTimeout(function () {
        t = g.slice();
        t.push(base + '2');
        SC.map.change(SC.robot.map, aX, aY, t, true);
        SC.background.key = '';
    }, 300);
    setTimeout(function () {
        t = g.slice();
        t.push(base + '3');
        SC.map.change(SC.robot.map, aX, aY, t, true);
        SC.background.key = '';
    }, 600);
    setTimeout(function () {
        t = g.slice();
        t.push(base + '4');
        SC.map.change(SC.robot.map, aX, aY, t, true);
        SC.background.key = '';
    }, 900);
    setTimeout(function () {
        // make it walkable
        dir = SC.dir(SC.robot.x, SC.robot.y, aX, aY);
        console.log('dir', dir);
        switch (dir) {
        case 'left':
            SC.edgeRemove(SC.robot.x, SC.robot.y, 1, 0, 0, 0);
            break;
        case 'right':
            SC.edgeRemove(SC.robot.x, SC.robot.y, 0, 1, 0, 0);
            break;
        case 'up':
            SC.edgeRemove(SC.robot.x, SC.robot.y, 0, 0, 1, 0);
            break;
        case 'down':
            SC.edgeRemove(SC.robot.x, SC.robot.y, 0, 0, 0, 1);
            break;
        }
        // callback
        if (aCallback) {
            aCallback();
        }
    }, 1200);
    return base;
};

SC.canForward = function () {
    // Return true if robot can go forward
    // cell edge
    var LEFT = 1, RIGHT = 2, UP = 4, DOWN = 8, e;
    // map edge
    if (SC.robot.x <= 0 && SC.robot.dir === 'left') {
        return false;
    }
    if (SC.robot.y <= 0 && SC.robot.dir === 'up') {
        return false;
    }
    if (SC.robot.x >= SC.maps[SC.robot.map].width - 1 && SC.robot.dir === 'right') {
        return false;
    }
    if (SC.robot.y >= SC.maps[SC.robot.map].height - 1 && SC.robot.dir === 'down') {
        return false;
    }
    // cell edge
    e = SC.maps[SC.robot.map].edge[SC.robot.y][SC.robot.x];
    switch (SC.robot.dir) {
    case "left":
        return (e & LEFT) === 0;
    case "right":
        return (e & RIGHT) === 0;
    case "up":
        return (e & UP) === 0;
    case "down":
        return (e & DOWN) === 0;
    }
    return false;
};

SC.canRight = function () {
    // Return true if robot can go right
    // cell edge
    var LEFT = 1, RIGHT = 2, UP = 4, DOWN = 8, e;
    // map edge
    if (SC.robot.y <= 0 && SC.robot.dir === 'left') {
        return false;
    }
    if (SC.robot.x >= SC.maps[SC.robot.map].width - 1 && SC.robot.dir === 'up') {
        return false;
    }
    if (SC.robot.y >= SC.maps[SC.robot.map].height - 1 && SC.robot.dir === 'right') {
        return false;
    }
    if (SC.robot.x <= 0 && SC.robot.dir === 'down') {
        return false;
    }
    // cell edge
    e = SC.maps[SC.robot.map].edge[SC.robot.y][SC.robot.x];
    switch (SC.robot.dir) {
    case "left":
        return (e & UP) === 0;
    case "right":
        return (e & DOWN) === 0;
    case "up":
        return (e & RIGHT) === 0;
    case "down":
        return (e & LEFT) === 0;
    }
    return false;
};

SC.canLeft = function () {
    // Return true if robot can go left
    // cell edge
    var LEFT = 1, RIGHT = 2, UP = 4, DOWN = 8, e;
    // map edge
    if (SC.robot.y <= 0 && SC.robot.dir === 'right') {
        return false;
    }
    if (SC.robot.x >= SC.maps[SC.robot.map].width - 1 && SC.robot.dir === 'down') {
        return false;
    }
    if (SC.robot.y >= SC.maps[SC.robot.map].height - 1 && SC.robot.dir === 'left') {
        return false;
    }
    if (SC.robot.x <= 0 && SC.robot.dir === 'up') {
        return false;
    }
    // cell edge
    e = SC.maps[SC.robot.map].edge[SC.robot.y][SC.robot.x];
    switch (SC.robot.dir) {
    case "left":
        return (e & DOWN) === 0;
    case "right":
        return (e & UP) === 0;
    case "up":
        return (e & LEFT) === 0;
    case "down":
        return (e & RIGHT) === 0;
    }
    return false;
};

SC.edge = function (aX, aY, aLeft, aRight, aUp, aDown) {
    // Change edge on map on given position
    var LEFT = 1, RIGHT = 2, UP = 4, DOWN = 8;
    SC.maps[SC.robot.map].edge[aY][aX] = (aLeft ? LEFT : 0) + (aRight ? RIGHT : 0) + (aUp ? UP : 0) + (aDown ? DOWN : 0);
};

SC.edgeRemove = function (aX, aY, aLeft, aRight, aUp, aDown) {
    // Remove edge from given position
    var LEFT = 1, RIGHT = 2, UP = 4, DOWN = 8,
        e = SC.maps[SC.robot.map].edge[aY][aX];
    if (aLeft && (e & LEFT)) {
        e -= LEFT;
    }
    if (aRight && (e & RIGHT)) {
        e -= RIGHT;
    }
    if (aUp && (e & UP)) {
        e -= UP;
    }
    if (aDown && (e & DOWN)) {
        e -= DOWN;
    }
    SC.maps[SC.robot.map].edge[aY][aX] = e;
};


