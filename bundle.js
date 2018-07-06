(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Ball = exports.BALL_RADIUS = undefined;

var _vec = require('./vec2');

var _entity = require('./entity');

var _game = require('./game');

/////// <reference path="entity.ts"/>
/////// <reference path="ship.ts"/>
var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var BALL_RADIUS = exports.BALL_RADIUS = 10;

var i = 3;
var Ball = /** @class */function (_super) {
    __extends(Ball, _super);
    function Ball(ballColor) {
        var _this = _super.call(this, new _vec.Vec2(0, 0), BALL_RADIUS) || this;
        _this.ballColor = ballColor;
        _this.invincible = true;
        return _this;
    }
    Ball.prototype.reset = function (pos) {
        this.invincible = true;
        this.p = pos;
    };
    Ball.prototype.draw = function () {
        noFill();
        stroke(this.ballColor);
        ellipse(this.p.x, this.p.y, BALL_RADIUS * 2, BALL_RADIUS * 2);
    };
    Ball.prototype.damage = function (_friendly) {
        if (!this.invincible) _game.Game.ship.die();
        return false;
    };
    return Ball;
}(_entity.Entity);
exports.Ball = Ball;

},{"./entity":9,"./game":12,"./vec2":20}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Base = undefined;

var _boxEntity = require('./boxEntity');

var _box = require('./box');

var _game = require('./game');

/////// <reference path="boxEntity.ts"/>
/////// <reference path="level.ts"/>
var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var Base = /** @class */function (_super) {
    __extends(Base, _super);
    function Base(p) {
        var _this = _super.call(this, p, new _box.Box(p.x + _game.TILE_SIZE / 2 - 10, p.y + _game.TILE_SIZE - 18, _game.TILE_SIZE / 2, 18)) || this;
        _this.invicible = false;
        return _this;
    }
    Base.prototype.draw = function () {
        stroke(255, 255, 0);
        noFill();
        push();
        translate(this.p.x + _game.TILE_SIZE / 2, this.p.y + _game.TILE_SIZE);
        beginShape();
        vertex(-8, 0);
        vertex(-7, -2);
        vertex(-3, -3);
        vertex(-3, -12);
        vertex(-9, -14);
        vertex(-8, -18);
        bezierVertex(-4, -14, 4, -14, 8, -18);
        //vertex(-4, -16);
        //vertex(4, -16);
        vertex(8, -18);
        vertex(9, -14);
        vertex(3, -12);
        vertex(3, -3);
        vertex(7, -2);
        vertex(8, 0);
        endShape();
        pop();
    };
    return Base;
}(_boxEntity.BoxEntity);
exports.Base = Base;

},{"./box":3,"./boxEntity":4,"./game":12}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Box = /** @class */function () {
    function Box(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    Box.prototype.collide = function (p, r) {
        return p.x + r > this.x && p.x - r < this.x + this.w && p.y + r > this.y && p.y - r < this.y + this.h;
    };
    return Box;
}();
exports.Box = Box;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BoxEntity = undefined;

var _vec = require('./vec2');

var _entity = require('./entity');

var _explosion = require('./explosion');

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
///// <reference path="entity.ts"/>

var BoxEntity = /** @class */function (_super) {
    __extends(BoxEntity, _super);
    function BoxEntity(p, box) {
        var _this = _super.call(this, p, NaN) || this;
        _this.box = box;
        return _this;
    }
    BoxEntity.prototype.collide = function (p, r) {
        return this.box.collide(p, r);
    };
    BoxEntity.prototype.explode = function () {
        var q = sqrt(_entity.EXPLOSION_DENSITY);
        for (var x = this.box.x; x < this.box.x + this.box.w; x += q) {
            for (var y = this.box.y; y < this.box.y + this.box.h; y += q) {
                _explosion.Explosion.create(new _vec.Vec2(x, y), 0, 1);
            }
        }
    };
    return BoxEntity;
}(_entity.Entity);
exports.BoxEntity = BoxEntity;

},{"./entity":9,"./explosion":10,"./vec2":20}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Bullet = exports.BULLET_SPEED = undefined;

var _particle = require('./particle');

var _level = require('./level');

var _game = require('./game');

///// <reference path="particle.ts"/>
///// <reference path="level.ts"/>
var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var BULLET_RADIUS = 1.5;
var BULLET_SPEED = exports.BULLET_SPEED = 250;
var Bullet = /** @class */function (_super) {
    __extends(Bullet, _super);
    function Bullet(p, v) {
        var _this = _super.call(this, p, BULLET_RADIUS, v) || this;
        _this.friendly = false;
        return _this;
    }
    Bullet.prototype.draw = function () {
        noStroke();
        fill(255, 255, 255);
        ellipse(this.p.x, this.p.y, BULLET_RADIUS * 2, BULLET_RADIUS * 2);
    };
    Bullet.prototype.move = function (dt) {
        return _super.prototype.move.call(this, dt) && this.p.y > -_level.MAX_HEIGHT && !_game.Game.level.collidePoint(this.p, this.r);
    };
    Bullet.prototype.collideEntities = function () {
        var p = this.p;
        var r = this.r;
        for (var iEntity = _game.Game.entities.length - 1; iEntity >= 0; iEntity--) {
            var entity = _game.Game.entities[iEntity];
            if (entity.solid && entity.collide(p, r)) return entity;
        }
        return null;
    };
    return Bullet;
}(_particle.Particle);
exports.Bullet = Bullet;

},{"./game":12,"./level":13,"./particle":15}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Checkpoint = undefined;

var _entity = require('./entity');

var _game = require('./game');

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var Checkpoint = /** @class */function (_super) {
    __extends(Checkpoint, _super);
    function Checkpoint(p) {
        var _this = _super.call(this, p, _game.TILE_SIZE * 2) || this;
        _this.solid = false;
        return _this;
    }
    Checkpoint.prototype.draw = function (_time) {};
    return Checkpoint;
}(_entity.Entity);
exports.Checkpoint = Checkpoint;

},{"./entity":9,"./game":12}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Ellipse = /** @class */function () {
    function Ellipse(p, d, a) {
        this.p = p;
        this.d = d;
        this.a = a;
        this.cosa = cos(a);
        this.sina = sin(a);
    }
    Ellipse.prototype.collide = function (p, r) {
        var dx = p.x - this.p.x;
        var dy = p.y - this.p.y;
        var a = (this.cosa * dx + this.sina * dy) / (this.d.x + r);
        var b = (this.sina * dx - this.cosa * dy) / (this.d.y + r);
        return a * a + b * b <= 1 / 4;
    };
    return Ellipse;
}();
exports.Ellipse = Ellipse;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Enemy = undefined;

var _vec = require('./vec2');

var _entity = require('./entity');

var _ellipse = require('./ellipse');

var _bullet = require('./bullet');

var _game = require('./game');

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
///// <reference path="entity.ts"/>
///// <reference path="level.ts"/>
///// <reference path="bullet.ts"/>

var ENEMY_FIRE_MIN = 0.5;
var ENEMY_FIRE_MAX = 4;
var SLOPE = Math.atan2(1, 2) * 360 / (2 * Math.PI);
var Enemy = /** @class */function (_super) {
    __extends(Enemy, _super);
    function Enemy(p, type) {
        var _this = this;
        var sx = type & 1 ? -1 : 1;
        var sy = type & 2 ? -1 : 1;
        p = p.plus(new _vec.Vec2(20, 20 + sy * 10));
        _this = _super.call(this, p, 15) || this;
        _this.sx = sx;
        _this.sy = sy;
        _this.ba = atan2(-2 * _this.sy, _this.sx);
        var bd = _vec.Vec2.fromAngle(_this.ba);
        _this.bp = p.plus(bd.times(16));
        _this.score = 750;
        _this.timeFire = 0;
        _this.ellipse = new _ellipse.Ellipse(p, new _vec.Vec2(40, 26), _this.sx * _this.sy * SLOPE);
        return _this;
    }
    Enemy.prototype.draw = function () {
        fill(0, 0, 0);
        stroke(_game.Game.level.ballColor);
        push();
        translate(this.p.x, this.p.y);
        scale(this.sx, this.sy);
        rotate(SLOPE);
        translate(-20, 0);
        beginShape();
        vertex(0, 0);
        vertex(6, -10);
        vertex(34, -10);
        vertex(40, 0);
        vertex(38, 0);
        bezierVertex(33, -10, 7, -10, 2, 0);
        endShape(CLOSE);
        beginShape();
        vertex(10, -10);
        bezierVertex(17, -15, 23, -15, 30, -10);
        endShape();
        pop();
    };
    Enemy.prototype.move = function (_dt) {
        if (!_game.Game.level.reactor.isDamaged() && (!this.timeFire || _game.Game.time > this.timeFire)) {
            this.timeFire = _game.Game.time + (random(ENEMY_FIRE_MIN, ENEMY_FIRE_MAX) + random(ENEMY_FIRE_MIN, ENEMY_FIRE_MAX)) / 2;
            var av = (random(-95, 95) + random(-95, 95) + random(-95, 95)) / 3;
            var bd = _vec.Vec2.fromAngle(this.ba + av);
            _game.Game.particles.push(new _bullet.Bullet(this.bp.clone(), bd.times(_bullet.BULLET_SPEED)));
        }
        return true;
    };
    Enemy.prototype.collide = function (p, r) {
        return this.ellipse.collide(p, r);
    };
    Enemy.prototype.damage = function (friendly) {
        if (friendly) {
            _game.Game.score += this.score;
            this.kill();
        }
        return false;
    };
    return Enemy;
}(_entity.Entity);
exports.Enemy = Enemy;

},{"./bullet":5,"./ellipse":7,"./entity":9,"./game":12,"./vec2":20}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Entity = exports.EXPLOSION_DENSITY = undefined;

var _game = require('./game');

var EXPLOSION_DENSITY = exports.EXPLOSION_DENSITY = 8; ///// <reference path="global.ts"/>

var Entity = /** @class */function () {
    function Entity(p, r) {
        this.p = p;
        this.r = r;
        this.solid = true;
    }
    Entity.prototype.collide = function (p, r) {
        var dx = this.p.x - p.x;
        var dy = this.p.y - p.y;
        var rr = this.r + r;
        return dx * dx + dy * dy < rr * rr;
    };
    Entity.prototype.remove = function () {
        var index = _game.Game.entities.indexOf(this);
        if (index >= 0) {
            _game.Game.entities.removeAt(index);
            return true;
        }
        return false;
    };
    Entity.prototype.explode = function () {
        Entity.createExplosion(this.p, this.r, 5 + this.r * this.r / EXPLOSION_DENSITY);
    };
    Entity.prototype.kill = function () {
        if (this.remove()) this.explode();
    };
    Entity.prototype.move = function (_dt) {
        return true;
    };
    Entity.prototype.damage = function (_friendly) {
        return false;
    };
    return Entity;
}();
exports.Entity = Entity;

},{"./game":12}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Explosion = undefined;

var _vec = require('./vec2');

var _particle = require('./particle');

var _game = require('./game');

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
///// <reference path="particle.ts"/>

var EXPLOSION_RADIUS = 1.5;
var Explosion = /** @class */function (_super) {
    __extends(Explosion, _super);
    function Explosion(p, v, color, life) {
        var _this = _super.call(this, p, EXPLOSION_RADIUS, v) || this;
        _this.color = color;
        _this.life = life;
        _this.time = _game.Game.time;
        return _this;
    }
    Explosion.prototype.draw = function (time) {
        noStroke();
        var t = (time - this.time) / this.life;
        fill(this.color, 255 * (1 - t * t));
        ellipse(this.p.x, this.p.y, this.r * 2, this.r * 2);
    };
    Explosion.prototype.move = function (dt) {
        this.v.scale(0.95);
        return _super.prototype.move.call(this, dt) && _game.Game.time - this.time < this.life && !_game.Game.level.collidePoint(this.p, this.r);
    };
    Explosion.create = function (p, r, c) {
        var particles = _game.Game.particles;
        for (var i = 0; i < c; i++) {
            var dir = _vec.Vec2.fromAngle(random() * 360);
            var ex = new Explosion(p.plus(dir.times(r * random())), dir.times(random(5, 150)), [255, random(255), 0], 0.25 + random() * 0.55);
            particles.push(ex);
        }
    };
    return Explosion;
}(_particle.Particle);
exports.Explosion = Explosion;

},{"./game":12,"./particle":15,"./vec2":20}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Fuel = undefined;

var _boxEntity = require('./boxEntity');

var _box = require('./box');

var _game = require('./game');

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var Fuel = /** @class */function (_super) {
    __extends(Fuel, _super);
    function Fuel(p, ballColor, color) {
        var _this = _super.call(this, p, new _box.Box(p.x + 8, p.y + 18, 24, 15)) || this;
        _this.ballColor = ballColor;
        _this.color = color;
        _this.fuel = 3;
        _this.score = 150;
        _this.refuelBox = new _box.Box(p.x, p.y - 50, 40, 80);
        return _this;
    }
    Fuel.prototype.draw = function () {
        push();
        translate(this.p.x + _game.TILE_SIZE / 2, this.p.y + _game.TILE_SIZE);
        stroke(255, 255, 0);
        beginShape();
        vertex(-12, -8);
        bezierVertex(-10, -6, 10, -6, 12, -8);
        bezierVertex(13, -9, 13, -19, 12, -20);
        bezierVertex(10, -22, -10, -22, -12, -20);
        bezierVertex(-13, -19, -13, -9, -12, -8);
        endShape();
        stroke(this.ballColor);
        line(-6, -6, -8, 0);
        line(6, -6, 8, 0);
        stroke(this.color);
        // F
        line(-10, -10, -10, -18);
        line(-10, -14, -7, -14);
        line(-10, -18, -6, -18);
        // U
        line(-4, -18, -4, -11);
        line(-4, -10, -0, -10);
        line(-0, -18, -0, -11);
        // E
        line(2, -18, 2, -10);
        line(2, -18, 5, -18);
        line(2, -14, 5, -14);
        line(2, -10, 5, -10);
        // L
        line(7, -18, 7, -10);
        line(7, -10, 10, -10);
        pop();
    };
    Fuel.prototype.damage = function (friendly) {
        if (friendly) {
            _game.Game.score += this.score;
            this.kill();
        }
        return false;
    };
    return Fuel;
}(_boxEntity.BoxEntity);
exports.Fuel = Fuel;

},{"./box":3,"./boxEntity":4,"./game":12}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var TILE_SIZE = exports.TILE_SIZE = 40;
var Game = /** @class */function () {
    function Game() {}
    Game.ship = null;
    Game.ball = null;
    Game.level = null;
    Game.levelImg = null;
    Game.particles = [];
    Game.entities = [];
    Game.score = 0;
    Game.lives = 3;
    Game.game = null;
    return Game;
}();
exports.Game = Game;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Level = exports.borderh = exports.borderw = exports.MAX_HEIGHT = undefined;

var _vec = require('./vec2');

var _reactor = require('./reactor');

var _enemy = require('./enemy');

var _base = require('./base');

var _checkpoint = require('./checkpoint');

var _fuel = require('./fuel');

var _ball = require('./ball');

var _game = require('./game');

var LAND_GAP = 40 / 8;
var LAND_THICKNESS = 2;
var MAX_HEIGHT = exports.MAX_HEIGHT = _game.TILE_SIZE * 15;
var borderw = exports.borderw = undefined;
var borderh = exports.borderh = undefined;
var SQRT5 = Math.sqrt(5);
var Level = /** @class */function () {
    function Level(color, ballColor, startPos, lines) {
        this.color = color;
        this.ballColor = ballColor;
        this.startPos = startPos;
        this.lines = lines;
        this.reactor = null;
        this.ballPos = null;
        this.checkpointPos = null;
    }
    Level.prototype.load = function (entities) {
        var lines = this.lines;
        var lh = lines.length;
        var lw = 0;
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var rgchLine = lines_1[_i];
            lw = Math.max(lw, rgchLine.length);
        }
        var bw = (lw + 2 * borderw) * _game.TILE_SIZE;
        var bh = (lh + borderh) * _game.TILE_SIZE;
        var gr = createGraphics(bw, bh, P2D);
        //const img = createImage(bw, bh);//, RGB);
        //img.sourceImg = gr.externals.canvas;
        //img.remote = true;
        this.checkpointPos = new _vec.Vec2((borderw + 0.5) * _game.TILE_SIZE, 0).plusScale(_game.Game.level.startPos, _game.TILE_SIZE);
        //gr.beginDraw();
        gr.background(0);
        gr.strokeWeight(LAND_THICKNESS);
        gr.stroke(this.color);
        for (var iLine = 0; iLine < lines.length; iLine++) {
            var rgchLine = lines[iLine];
            for (var ich = 0; ich < rgchLine.length; ich++) {
                var p = new _vec.Vec2((borderw + ich) * _game.TILE_SIZE, iLine * _game.TILE_SIZE);
                var entity = null;
                var ch = rgchLine[ich];
                switch (ch) {
                    case 'a':
                        entity = this.reactor = new _reactor.Reactor(p, this.ballColor, this.color);
                        break;
                    case 'b':
                        entity = new _fuel.Fuel(p, this.ballColor, this.color);
                        break;
                    case 'c':
                        entity = new _enemy.Enemy(p, 0);
                        break;
                    case 'd':
                        entity = new _enemy.Enemy(p, 1);
                        break;
                    case 'e':
                        entity = new _enemy.Enemy(p, 2);
                        break;
                    case 'f':
                        entity = new _enemy.Enemy(p, 3);
                        break;
                    case 'g':
                        entity = new _base.Base(p);
                        this.ballPos = new _vec.Vec2((borderw + ich + 0.5) * _game.TILE_SIZE, iLine * _game.TILE_SIZE + _game.TILE_SIZE - 18 - _ball.BALL_RADIUS);
                        break;
                    case 'k':
                        entity = new _checkpoint.Checkpoint(p);
                        break;
                }
                if (entity) entities.push(entity);
            }
            for (var y = 0; y < _game.TILE_SIZE; y += LAND_GAP) {
                var lx = -10000;
                var ly = iLine * _game.TILE_SIZE + y;
                var land = rgchLine[0] === '1';
                for (var ich = 0; ich < rgchLine.length; ich++) {
                    var end = void 0;
                    var start = void 0;
                    var ch = rgchLine[ich];
                    switch (ch) {
                        default:
                        case '0':
                            end = 0;
                            start = _game.TILE_SIZE;
                            break;
                        case '1':
                            start = 0;
                            end = _game.TILE_SIZE;
                            break;
                        case '2':
                            start = 0;
                            end = 2 * y;
                            break;
                        case '3':
                        case 'c':
                            start = 0;
                            end = 2 * y - _game.TILE_SIZE;
                            break;
                        case '4':
                        case 'd':
                            start = _game.TILE_SIZE * 2 - 2 * y;
                            end = _game.TILE_SIZE;
                            break;
                        case '5':
                            start = _game.TILE_SIZE - 2 * y;
                            end = _game.TILE_SIZE;
                            break;
                        case '6':
                            start = 0;
                            end = _game.TILE_SIZE * 2 - 2 * y;
                            break;
                        case '7':
                        case 'e':
                            start = 0;
                            end = _game.TILE_SIZE - 2 * y;
                            break;
                        case '8':
                        case 'f':
                            start = 2 * y;
                            end = _game.TILE_SIZE;
                            break;
                        case '9':
                            start = 2 * y - _game.TILE_SIZE;
                            end = _game.TILE_SIZE;
                            break;
                    }
                    var x = (borderw + ich) * _game.TILE_SIZE;
                    if (start < 0) {
                        start = 0;
                    }
                    if (end > _game.TILE_SIZE) {
                        end = _game.TILE_SIZE;
                    }
                    if (land) {
                        if (start > 0) {
                            gr.line(lx, ly, x - 1, ly);
                            if (start < _game.TILE_SIZE) lx = x + Math.min(_game.TILE_SIZE, start);else land = false;
                        } else if (end < _game.TILE_SIZE) {
                            gr.line(lx, ly, x + Math.max(0, end) - 1, ly);
                            land = false;
                        }
                    } else if (end > start) {
                        if (start >= 0 && start < _game.TILE_SIZE) {
                            land = true;
                            lx = x + Math.min(_game.TILE_SIZE, start);
                        }
                    }
                }
                if (land) gr.line(lx, ly, 10000, ly);
            }
            for (var y = 0; y < _game.TILE_SIZE * borderh; y += LAND_GAP) {
                var ly = lh * _game.TILE_SIZE + y;
                gr.line(-1000, ly, 10000, ly);
            }
        }
        //gr.endDraw();
        return {
            entities: entities,
            image: gr
        };
    };
    Level.prototype.collidePoint = function (p, r, offset) {
        var lines = this.lines;
        var mx = Math.floor(p.x / _game.TILE_SIZE);
        var my = Math.floor(p.y / _game.TILE_SIZE);
        if (offset) {
            mx += offset.x;
            my += offset.y;
        }
        var x = p.x - mx * _game.TILE_SIZE;
        var y = p.y - my * _game.TILE_SIZE;
        mx -= borderw;
        if (my < 0) {
            return false;
        }
        if (my >= lines.length) {
            return true;
        }
        var line = lines[my];
        if (mx < 0) {
            mx = 0;
        } else if (mx >= line.length) {
            mx = line.length - 1;
        }
        switch (line[mx]) {
            default:
            case '0':
                return false;
            case '1':
                return true;
            case '2':
                return y + r * SQRT5 / 2 > x / 2;
            case '3':
            case 'c':
                return y + r * SQRT5 / 2 > _game.TILE_SIZE / 2 + x / 2;
            case '4':
            case 'd':
                return y + r * SQRT5 / 2 > _game.TILE_SIZE - x / 2;
            case '5':
                return y + r * SQRT5 / 2 > _game.TILE_SIZE / 2 - x / 2;
            case '6':
                return y - r * SQRT5 / 2 < _game.TILE_SIZE - x / 2;
            case '7':
            case 'e':
                return y - r * SQRT5 / 2 < _game.TILE_SIZE / 2 - x / 2;
            case '8':
            case 'f':
                return y - r * SQRT5 / 2 < x / 2;
            case '9':
                return y - r * SQRT5 / 2 < _game.TILE_SIZE / 2 + x / 2;
        }
    };
    Level.prototype.collideEntity = function (entity) {
        var p = entity.p;
        var r = entity.r;
        var px = (p.x + _game.TILE_SIZE * 1000) % _game.TILE_SIZE;
        var py = (p.y + _game.TILE_SIZE * 1000) % _game.TILE_SIZE;
        var offset = new _vec.Vec2(0, 0);
        for (var mx = Math.floor((px - r) / _game.TILE_SIZE); mx <= Math.floor((px + r) / _game.TILE_SIZE); mx += 1) {
            for (var my = Math.floor((py - r) / _game.TILE_SIZE); my <= Math.floor((py + r) / _game.TILE_SIZE); my += 1) {
                offset.x = mx;
                offset.y = my;
                if (this.collidePoint(p, r, offset)) return true;
            }
        }
        return false;
    };
    Level.initializeLevels = function (width, height) {
        exports.borderw = borderw = Math.ceil(width / _game.TILE_SIZE / 2);
        exports.borderh = borderh = Math.ceil(height / _game.TILE_SIZE / 2);
        Level.levels = [new Level(color(255, 0, 0), color(0, 255, 0), new _vec.Vec2(5, -2), ["00000000000k000a0", "12300b00000000111", "11111112c000g0111"]), new Level(color(0, 255, 0), color(255, 0, 0), new _vec.Vec2(2, -2), ["0a000000000k0000000451123", "1112300000000000045111111", "1111123000000004511111111", "1111111230000451111111111", "1111111112000111111111111", "1111111111000111111111111", "1111111111000111111111111", "11111111110k0111111111111", "1111111111000911111111111", "11111111670000f9111111111", "1111116e00000000111111111", "1111110000000000111111111", "1111110000000045111111111", "11111123g00b4511111111111"]), new Level(color(0, 255, 255), color(0, 255, 0), new _vec.Vec2(10, -2), ["10000000000b00000000000", "11111111111111100000001", "1111111111111110000a001", "11111111111111100011111", "11111111111111100011111", "11111111111111100011111", "11111111111111100011111", "11111111111116e0k000001", "11111111111110000000001", "11111111111110000bbb0d1", "11111111111110000111111", "11111111111110000111111", "11111111111110000111111", "1111116e000000000111111", "11111100000000000111111", "1111110000000b000111111", "11111100000011111111111", "16e00000000011111111111", "100000k0000011111111111", "10000000b00011111111111", "100000d5111111111111111", "10000011111111111111111", "10000011111111111111111", "10000011111111111111111", "10000011111111111111111", "1230g011111111111111111"]), new Level(color(0, 255, 0), color(255, 0, 255), new _vec.Vec2(6, -2), ["1112300000001111111111", "1111123000001111111111", "1111111111001111111111", "1111111111001111111111", "1111111111001111111111", "1111111111001111111111", "1111111167001111111111", "1111116e00001111111111", "1111670000001111111111", "11670000k0001111111111", "1100000000001111111111", "1100000000001111111111", "1112c00111111111111111", "1111600111111111111111", "116e000891111111111111", "1700000008911111111111", "10000000000f9111111111", "1000000000000000000001", "100a000000000000k00001", "1111111112c000000000i1", "11111111111230000b0001", "1111111111111111111001", "1111111111111111111j01", "1111111111111111111001", "11111111111111111670i1", "1111111111111116e00001", "1111111111111670000001", "1111111111111000k00001", "1111111111111000000d51", "1111111111111230045111", "1111111111111110011111", "111111111111111g011111"]), new Level(color(255, 0, 0), color(255, 0, 255), new _vec.Vec2(5, -2), ["0000000k0000000000000", "111230000001111111111", "111112000001111111111", "1111110b0001111111111", "111111111001111111111", "111111111001111111111", "111111111001111111111", "111111111001111111111", "111111111001111111111", "111116e000k00f9111111", "111110000000000111111", "1111100000a0bb0111111", "111111100111111111111", "111111100111111111111", "111111100111111111111", "111111600011111111111", "11116700k011111111111", "100000000011111111111", "100000000011111111111", "10000b000d11111111111", "100011111111111111111", "100011111111111111111", "100089111111111111111", "100000891111111111111", "123000008911111111111", "111230000011111111111", "1111100k0011111111111", "111100000011111111111", "111100000000f91111111", "11112c0bb000001111111", "111111111000001111111", "111111111000000001111", "1111111110000000i1111", "1111111112c0bb0001111", "111111111111111001111", "111111111111111j01111", "111111111111111008911", "1111111111111110000f1", "11111111111111100k001", "111111111111111h00001", "111111111111111000041", "1111111111111113g4511", "111111111111111111111", "111111111111111111111", "111111111111111111111", "111111111111111111111"]), new Level(color(255, 255, 0), color(0, 255, 0), new _vec.Vec2(5, -2), ["0000000000000000000000000001111111111123000", "0451230045123000000045111001111111111111230", "1111110011111230004511111001111000000891111", "1111110011111111111111111009116000000001111", "1111110000000891111111111000000000000001111", "1111110000000001111111111000000000110001111", "1111112300000001111111111300000000110001111", "1111111111111001111111111111111111110001111", "1111111111111008111111111111111111670001111", "1111111111111000111111111111111167000001111", "1111111111111005111111111111111100000041111", "1111111111117001111111111111111100000011111", "1111111111110001111111111111111100450011111", "1111111111112008911111111111116700110011111", "1111111111111000089111111111670000110011111", "1111111111111000000891111167000000110011111", "1111111111111230000008916700000045110011111", "1111111111111112300000000000004511110011111", "1111111111111111123000000000451111700008111", "1111111111111111111234512345111111000000111", "1111111111111111111111111111111111000000111", "1111111111111111111111111111111111000000111"])];
    };
    return Level;
}();
exports.Level = Level;

},{"./ball":1,"./base":2,"./checkpoint":6,"./enemy":8,"./fuel":11,"./game":12,"./reactor":16,"./vec2":20}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.currentLevel = undefined;

var _ball = require("./ball");

var _ship = require("./ship");

var _bullet = require("./bullet");

var _star = require("./star");

var _vec = require("./vec2");

var _level = require("./level");

var _fuel = require("./fuel");

var _checkpoint = require("./checkpoint");

var _entity = require("./entity");

var _game = require("./game");

var _explosion = require("./explosion");

///// <reference path="level.ts"/>
var RENDER_SCALE = 0.5;
var bonus;
var font;
var fontHeight;
var KEY_LEFT = 'Z'.charCodeAt(0);
var KEY_RIGHT = 'X'.charCodeAt(0);
var KEY_FIRE = 13; //ENTER;
var KEY_THRUST = 16; //SHIFT;
var KEY_SHIELD = ' '.charCodeAt(0);
var instrs = ["Z, X : ROTATE", "ENTER : FIRE", "SPACE : SHIELD / TRACTOR", "SHIFT : THRUST"];
var GameState;
(function (GameState) {
    GameState[GameState["START"] = 0] = "START";
    GameState[GameState["PLAY"] = 1] = "PLAY";
    GameState[GameState["DEATH"] = 2] = "DEATH";
    GameState[GameState["OVER"] = 3] = "OVER";
    GameState[GameState["ORBIT"] = 4] = "ORBIT";
    GameState[GameState["DESTROYED"] = 5] = "DESTROYED";
})(GameState || (GameState = {}));
var gameState = GameState.START;
function setGame(state) {
    if (gameState === state) return;
    gameState = state;
    switch (gameState) {
        case GameState.DEATH:
        case GameState.ORBIT:
        case GameState.DESTROYED:
        case GameState.OVER:
            if (_game.Game.ship.fuel < 0) _game.Game.ship.fuel = 0;
            if (_game.Game.lives < 0) _game.Game.lives = 0;
            break;
    }
}
var START_LEVEL = 0;
var THRUST_FUEL_RATE = 1 / 9;
var REFUEL_RATE = 3;
var TURN_SPEED = 275;
var timePrev;
var waitTime;
//let paused: boolean = false;
var wasAttaching;
var currentLevel = exports.currentLevel = START_LEVEL;
var keys = {};
window['keyPressed'] = function () {
    keys[+keyCode] = true;
};
window['keyReleased'] = function () {
    keys[+keyCode] = false;
};
function newGame() {
    _game.Game.ball = new _ball.Ball(color(255));
    _game.Game.ship = new _ship.Ship();
    _game.Game.score = 0;
    _game.Game.lives = 3;
    exports.currentLevel = currentLevel = START_LEVEL;
    startLevel();
}
function startLevel() {
    _game.Game.entities.length = 0;
    _game.Game.entities.push(_game.Game.ship, _game.Game.ball);
    _game.Game.level = _level.Level.levels[currentLevel];
    var levelInfo = _game.Game.level.load(_game.Game.entities);
    _game.Game.levelImg = levelInfo.image;
    _game.Game.ball.ballColor = _game.Game.level.ballColor;
    resetLevel();
}
function resetLevel() {
    timePrev = millis() / 1000.0;
    _game.Game.entities.remove(_game.Game.ship);
    _game.Game.entities.remove(_game.Game.ball);
    _game.Game.entities.remove(_game.Game.level.reactor);
    _game.Game.entities.push(_game.Game.ship, _game.Game.ball, _game.Game.level.reactor);
    var level = _level.Level.levels[currentLevel];
    _game.Game.ball.reset(level.ballPos);
    _game.Game.ship.reset();
    _game.Game.ship.move(0);
    level.reactor.reset();
    wasAttaching = false;
    bonus = 0;
    setGame(GameState.START);
}
var starSum = 0;
window['draw'] = function () {
    var ship = _game.Game.ship;
    var level = _game.Game.level;
    var time = _game.Game.time = millis() / 1000.0;
    var dt = _game.Game.time - timePrev;
    timePrev = _game.Game.time;
    if (ship.dead) {
        ship.dead = false;
        ship.kill();
        waitTime = _game.Game.time + 1.5;
        setGame(GameState.DEATH);
    }
    var attaching = false;
    switch (gameState) {
        case GameState.PLAY:
        case GameState.START:
            if (keys[KEY_LEFT]) ship.rotate(-TURN_SPEED * dt);else if (keys[KEY_RIGHT]) ship.rotate(TURN_SPEED * dt);
            ship.shield = false;
            ship.refuel = false;
            if (!!keys[KEY_SHIELD]) attaching = ship.activateShield(dt, wasAttaching);
            ship.fire(keys[KEY_FIRE]);
            for (var iEntity = _game.Game.entities.length - 1; iEntity >= 0; iEntity--) {
                if (iEntity >= _game.Game.entities.length) continue; // handle when multiple entries are removed (eg ship & ball)
                var entity = _game.Game.entities[iEntity];
                if (entity !== ship || gameState === GameState.PLAY) {
                    if (entity.move(dt) === false) {
                        _game.Game.entities.removeAt(iEntity);
                        continue;
                    }
                }
                if (gameState === GameState.PLAY) {
                    if (entity.solid) {
                        if (entity !== ship && entity.collide(ship.p, ship.r) || entity !== _game.Game.ball && entity.collide(_game.Game.ball.p, _game.Game.ball.r)) {
                            ship.die();
                            continue;
                        }
                        if (ship.shield && entity instanceof _fuel.Fuel && entity.refuelBox.collide(ship.p, 0)) {
                            var df = Math.min(entity.fuel, dt * REFUEL_RATE);
                            entity.fuel -= df;
                            ship.fuel += df;
                            ship.refuel = true;
                            if (entity.fuel <= 0) {
                                _game.Game.entities.removeAt(iEntity);
                                _game.Game.score += 300;
                                continue;
                            }
                        }
                    } else if (entity instanceof _checkpoint.Checkpoint) {
                        if (entity.collide(ship.p, ship.r)) {
                            _game.Game.entities.removeAt(iEntity);
                            level.checkpointPos = entity.p;
                            continue;
                        }
                    }
                }
            }
            if (gameState === GameState.PLAY) {
                ship.thrust = keys[KEY_THRUST] && ship.p.y > -_level.MAX_HEIGHT && ship.fuel > 0;
                if (ship.thrust) ship.fuel = Math.max(0, ship.fuel - dt * THRUST_FUEL_RATE);
                if (level.collideEntity(ship) || level.collideEntity(_game.Game.ball)) {
                    ship.die();
                }
                if (ship.p.y < -_level.MAX_HEIGHT) {
                    if (ship.rod) {
                        bonus += 2000;
                        if (level.reactor.life <= 0) bonus += 2000;
                    }
                    waitTime = time + 3;
                    setGame(GameState.ORBIT);
                }
                if (level.reactor.timeExplode && time > level.reactor.timeExplode) {
                    for (var iEntity = _game.Game.entities.length - 1; iEntity >= 0; iEntity--) {
                        if (iEntity <= _game.Game.entities.length) _game.Game.entities[iEntity].kill();
                    }waitTime = time + 3;
                    setGame(GameState.DESTROYED);
                }
            } else if (gameState === GameState.START) {
                if (keys[KEY_THRUST]) setGame(GameState.PLAY);
            }
            wasAttaching = attaching;
            break;
    }
    if (gameState === GameState.ORBIT) {
        background(0, 0, 0);
    } else {
        // move particles
        for (var iParticle = _game.Game.particles.length - 1; iParticle >= 0; iParticle--) {
            var particle = _game.Game.particles[iParticle];
            if (particle.move(dt) === false) {
                _game.Game.particles.removeAt(iParticle);
                continue;
            }
            var entity = particle.collideEntities();
            if (entity) {
                _game.Game.particles.removeAt(iParticle);
                if (gameState === GameState.PLAY && particle instanceof _bullet.Bullet && entity.damage(particle.friendly)) {
                    _explosion.Explosion.create(particle.p, 0, 4);
                }
            }
        }
        var px = ship.p.x;
        var py = ship.p.y;
        var sw = width / RENDER_SCALE;
        var sh = height / RENDER_SCALE;
        noStroke();
        // draw sky
        var yl = height / 2 - py * RENDER_SCALE + 1;
        if (yl > 0) {
            fill(0, 0, 0);
            rect(0, 0, width, yl);
            // add stars
            starSum += random(width * yl) / 5000000;
            while (starSum > 1) {
                starSum -= 1;
                var syMin = py - sh / 2;
                var syMax = Math.min(0, py + sh / 2);
                var sy = random(syMin, syMax);
                var sx = px + random(-1, 1) * sw / 2;
                var star = new _star.Star(new _vec.Vec2(sx, sy));
                _game.Game.particles.push(star);
            }
        }
        push();
        translate(width / 2, height / 2);
        scale(RENDER_SCALE, RENDER_SCALE);
        translate(-px, -py);
        // draw level
        image(_game.Game.levelImg, 0, 0);
        if (px < width / 2) image(_game.Game.levelImg, -_game.Game.levelImg.width, 0);else if (px > _game.Game.levelImg.width - width / 2) image(_game.Game.levelImg, _game.Game.levelImg.width, 0);
        // draw particles
        strokeWeight(0.25);
        for (var _i = 0, _a = _game.Game.particles; _i < _a.length; _i++) {
            var particle = _a[_i];
            particle.draw(time);
        }
        // draw entities
        stroke(255, 255, 255);
        strokeWeight(1.3);
        fill(0, 0, 0);
        for (var _b = 0, _c = _game.Game.entities; _b < _c.length; _b++) {
            var entity = _c[_b];
            if (Math.abs(entity.p.x - px) <= sw / 2 + _game.TILE_SIZE && Math.abs(entity.p.y - py) <= sh / 2 + _game.TILE_SIZE) {
                entity.draw(time);
            }
        }
        // draw rod
        stroke(level.color);
        if (ship.rod) ship.rod.draw();else if (attaching) line(ship.p.x, ship.p.y, _game.Game.ball.p.x, _game.Game.ball.p.y);
        pop();
    }
    // draw header
    fill(0, 0, 0, 64);
    rect(0, 0, width, fontHeight * 2 + fontHeight);
    fill(255, 255, 255);
    textAlign(LEFT, TOP);
    text("FUEL", fontHeight / 2, fontHeight / 2);
    text((ship.fuel * 100).toFixed(), fontHeight / 2, fontHeight * 3 / 2);
    textAlign(RIGHT, TOP);
    text("SCORE", width - fontHeight / 2, fontHeight / 2);
    text("" + _game.Game.score, width - fontHeight / 2, fontHeight * 3 / 2);
    textAlign(CENTER, TOP);
    text("LIVES", width / 2, fontHeight / 2);
    text("" + _game.Game.lives, width / 2, fontHeight * 3 / 2);
    switch (gameState) {
        case GameState.PLAY:
            var reactor = level.reactor;
            if (reactor && reactor.timeExplode > time) {
                stroke(255, 255, 255);
                fill(255, 255, 255);
                textAlign(CENTER, TOP);
                text(floor(reactor.timeExplode - time).toString(), width / 2, height / 4);
            }
            break;
        case GameState.START:
            fill(255, 255, 255);
            noStroke();
            textAlign(CENTER, TOP);
            text("THRUST TO START", 0, height * 2 / 3 + fontHeight * 2, width, height);
            if (_game.Game.score === 0) {
                text("RESCUE THE POD", 0, height * 2 / 3 - fontHeight, width, height);
                text("DESTROY THE REACTOR", 0, height * 2 / 3 + 0, width, height);
                text("ESCAPE TO ORBIT", 0, height * 2 / 3 + fontHeight, width, height);
                textAlign(LEFT, TOP);
                for (var i = 0; i < instrs.length; i++) {
                    var it = instrs[i];
                    var mt = textWidth(it.substr(0, it.indexOf(':') + 1));
                    text(it, width / 2 - mt, height / 3 + (i - instrs.length * 2 / 3) * fontHeight, width, height);
                }
            }
            break;
        case GameState.DEATH:
            if (time > waitTime && !keys[KEY_THRUST]) {
                if (--_game.Game.lives >= 0 && ship.fuel > 0) resetLevel();else {
                    waitTime = time + 2;
                    setGame(GameState.OVER);
                }
            }
            break;
        case GameState.OVER:
            fill(255, 255, 255);
            textAlign(CENTER, TOP);
            text("GAME OVER", width / 2, height / 3);
            if (time > waitTime) {
                text("THRUST TO START", 0, height * 2 / 3 + fontHeight * 2, width, height);
                if (keys[KEY_THRUST]) {
                    newGame();
                }
            }
            break;
        case GameState.ORBIT:
            noStroke();
            textAlign(CENTER, TOP);
            var nextLevel = ship.rod || level.reactor.life <= 0;
            if (!nextLevel) {
                fill(level.ballColor);
                text("MISSION INCOMPLETE", 0, height / 3, width, height);
            } else {
                if (level.reactor.life <= 0) {
                    fill(level.color);
                    text("PLANET DESTROYED", 0, height / 3 + 0, width, height);
                }
                fill(level.ballColor);
                textAlign(RIGHT, TOP);
                text("MISSION", width / 2 - fontHeight / 2, height / 3 + fontHeight * 2, 0, height);
                textAlign(LEFT, TOP);
                text(ship.rod ? "COMPLETE" : "FAILED", width / 2 + fontHeight / 2, height / 3 + fontHeight * 2, 0, height);
                fill(255, 255, 0);
                textAlign(CENTER, TOP);
                text((currentLevel + 1).toString(), 0, height / 3 + fontHeight * 2, width, height);
                text(ship.rod ? "BONUS " + bonus : "NO BONUS", 0, height / 3 + fontHeight * 4, width, height);
            }
            if (time > waitTime && !keys[KEY_THRUST]) {
                if (nextLevel) exports.currentLevel = currentLevel += 1;
                startLevel();
            }
            break;
        case GameState.DESTROYED:
            if (time > waitTime && !keys[KEY_THRUST]) startLevel();
            break;
    }
};
window['preload'] = function () {
    //p5['disableFriendlyErrors'] = true;
    font = loadFont("assets/supersimf.ttf");
};
window['windowResized'] = function () {
    pixelDensity(1);
    createCanvas(windowWidth, windowHeight);
    RENDER_SCALE = Math.min(width, height) / 400;
    textSize(Math.ceil(17 * RENDER_SCALE));
    fontHeight = Math.ceil(17 * RENDER_SCALE);
};
window['setup'] = function () {
    _entity.Entity.createExplosion = _explosion.Explosion.create;
    windowResized();
    textFont(font);
    stroke(255, 255, 255);
    fill(0, 0, 0);
    angleMode(DEGREES);
    _level.Level.initializeLevels(width, height);
    newGame();
};

},{"./ball":1,"./bullet":5,"./checkpoint":6,"./entity":9,"./explosion":10,"./fuel":11,"./game":12,"./level":13,"./ship":18,"./star":19,"./vec2":20}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Particle = undefined;

var _entity = require('./entity');

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var Particle = /** @class */function (_super) {
    __extends(Particle, _super);
    function Particle(p, r, v) {
        var _this = _super.call(this, p, r) || this;
        _this.v = v;
        return _this;
    }
    Particle.prototype.move = function (dt) {
        this.p.addScale(this.v, dt);
        return true;
    };
    Particle.prototype.collideEntities = function () {
        return null;
    };
    return Particle;
}(_entity.Entity);
exports.Particle = Particle;

},{"./entity":9}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Reactor = undefined;

var _vec = require('./vec2');

var _boxEntity = require('./boxEntity');

var _box = require('./box');

var _explosion = require('./explosion');

var _game = require('./game');

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
///// <reference path="boxEntity.ts"/>

var REACTOR_LIFE = 10;
var REACTOR_HEAL = 1 / 4;
var Reactor = /** @class */function (_super) {
    __extends(Reactor, _super);
    function Reactor(p, ballColor, color) {
        var _this = _super.call(this, p, new _box.Box(p.x + 6, p.y + 13, 31, 17)) || this;
        _this.ballColor = ballColor;
        _this.color = color;
        _this.invincible = true;
        _this.timeSmoke = 0;
        _this.timeExplode = 0;
        _this.life = REACTOR_LIFE;
        return _this;
    }
    Reactor.prototype.draw = function (time) {
        if (this.timeExplode) {
            var timeExplode = (this.timeExplode - time) * 2;
            if (timeExplode - Math.trunc(timeExplode) > 0.5) return;
        }
        push();
        translate(this.p.x, this.p.y);
        stroke(0, 255, 0);
        ellipse(20, 22, 30, 24);
        fill(0, 0, 0);
        stroke(this.ballColor);
        beginShape();
        vertex(3, 40);
        vertex(3, 30);
        vertex(28, 30);
        vertex(28, 10);
        vertex(33, 10);
        vertex(33, 30);
        vertex(37, 30);
        vertex(37, 40);
        endShape();
        stroke(this.color);
        noFill();
        beginShape();
        vertex(6, 40);
        vertex(6, 33);
        vertex(9, 33);
        vertex(9, 40);
        endShape();
        pop();
    };
    Reactor.prototype.move = function (dt) {
        if (_game.Game.time > this.timeSmoke && !this.isDamaged()) {
            this.timeSmoke = _game.Game.time + random(0.3, 0.4);
            var grey = random(192, 255);
            _game.Game.particles.push(new _explosion.Explosion(this.p.plus(new _vec.Vec2(30, 8)), new _vec.Vec2(0, -60), [grey, grey, grey], random(0.65, 0.85)));
        }
        if (this.life > 0) this.life = Math.min(REACTOR_LIFE, this.life + dt * REACTOR_HEAL);
        return true;
    };
    Reactor.prototype.damage = function (_friendly) {
        if (this.life > 0) {
            this.life -= 1;
            if (this.life < 0) this.timeExplode = _game.Game.time + 10;
        }
        return true;
    };
    Reactor.prototype.isDamaged = function () {
        return this.life < 10;
    };
    Reactor.prototype.reset = function () {
        this.life = REACTOR_LIFE;
        this.timeExplode = 0;
    };
    return Reactor;
}(_boxEntity.BoxEntity);
exports.Reactor = Reactor;

},{"./box":3,"./boxEntity":4,"./explosion":10,"./game":12,"./vec2":20}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Rod = undefined;

var _vec = require('./vec2');

var _entity = require('./entity');

var _game = require('./game');

var _explosion = require('./explosion');

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
///// <reference path="entity.ts"/>

var Rod = /** @class */function (_super) {
    __extends(Rod, _super);
    function Rod(p, a) {
        var _this = _super.call(this, p, 0) || this;
        _this.a = a;
        _this.va = 0;
        _this.v = new _vec.Vec2(0, 0);
        _this.dir = new _vec.Vec2(0, 0);
        return _this;
    }
    Rod.prototype.reset = function () {
        this.p = new _vec.Vec2(width / 2 + 2 * _game.TILE_SIZE, -2 * _game.TILE_SIZE);
        this.v = new _vec.Vec2(0, 0);
        this.a = -90;
        this.va = 0;
    };
    Rod.prototype.draw = function () {
        line(_game.Game.ship.p.x, _game.Game.ship.p.y, _game.Game.ball.p.x, _game.Game.ball.p.y);
    };
    Rod.prototype.explode = function () {
        var cr = 20;
        for (var i = 0; i < cr; i++) {
            var rp = _game.Game.ship.p.times(i / cr).plus(_game.Game.ball.p.times(1 - i / cr));
            _explosion.Explosion.create(rp, 3, 1);
        }
    };
    return Rod;
}(_entity.Entity);
exports.Rod = Rod;

},{"./entity":9,"./explosion":10,"./game":12,"./vec2":20}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Ship = undefined;

var _vec = require('./vec2');

var _entity = require('./entity');

var _rod = require('./rod');

var _bullet = require('./bullet');

var _game = require('./game');

///// <reference path="entity.ts"/>
///// <reference path="ball.ts"/>
var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var SHIP_RADIUS = 14.5;
var SHIELD_RADIUS = 16;
var SHIP_WEIGHT = 0.75;
var THRUST = 200;
var SHIELD_FUEL_RATE = 1 / 5;
var BALL_WEIGHT = 0.75;
var CABLE_LENGTH = 70;
var TOTAL_WEIGHT = SHIP_WEIGHT + BALL_WEIGHT;
var BALL_FRACTION = SHIP_WEIGHT / TOTAL_WEIGHT;
var SHIP_FRACTION = BALL_WEIGHT / TOTAL_WEIGHT;
var BALL_DISTANCE = CABLE_LENGTH * BALL_FRACTION;
var SHIP_DISTANCE = CABLE_LENGTH * SHIP_FRACTION;
var INERTIA = SHIP_WEIGHT * SHIP_DISTANCE * SHIP_DISTANCE + BALL_WEIGHT * BALL_DISTANCE * BALL_DISTANCE;
var FRICTION = 1; //0.99;
var G = 45;
var CABLE_FORCE = G / 40;
var Ship = /** @class */function (_super) {
    __extends(Ship, _super);
    function Ship() {
        var _this = _super.call(this, new _vec.Vec2(0, 0), SHIP_RADIUS) || this;
        _this.rod = null;
        _this.dir = new _vec.Vec2(0, 0);
        _this.v = new _vec.Vec2(0, 0);
        _this.a = -90;
        _this.thrust = false;
        _this.shield = false;
        _this.refuel = false;
        _this.fuel = 10;
        _this.timeFire = 0;
        _this.dead = false;
        _this.rotateTo(-90);
        return _this;
    }
    Ship.prototype.reset = function () {
        this.p = _game.Game.level.checkpointPos.clone();
        this.v = new _vec.Vec2(0, 0);
        this.rotateTo(-90);
        this.thrust = false;
        this.shield = false;
        this.rod = null;
    };
    Ship.prototype.draw = function () {
        fill(0, 0, 0);
        stroke(255, 255, 0);
        push();
        translate(this.p.x, this.p.y);
        if (this.refuel && random() < 0.5) {
            line(10, 20, 24, 60);
            line(-10, 20, -24, 60);
        }
        rotate(this.a + 90);
        if (this.shield && random() < 0.5) ellipse(0, -3, SHIELD_RADIUS * 2, SHIELD_RADIUS * 2);else {
            beginShape();
            vertex(0, -18);
            vertex(9, -1);
            vertex(13, 1);
            vertex(6, 11);
            vertex(3, 8);
            vertex(-3, 8);
            vertex(-6, 11);
            vertex(-13, 1);
            vertex(-9, -1);
            endShape(CLOSE);
            if (this.thrust && random() < 0.5) {
                line(0, 13, 2, 11);
                line(0, 13, -2, 11);
            }
        }
        pop();
    };
    Ship.prototype.rotate = function (da) {
        this.rotateTo(this.a + da);
    };
    Ship.prototype.rotateTo = function (a) {
        this.a = a;
        this.dir.x = cos(a);
        this.dir.y = sin(a);
    };
    Ship.prototype.move = function (dt) {
        var rod = this.rod;
        if (rod) {
            var dir = _vec.Vec2.fromAngle(rod.a);
            var playerOffset = dir.times(SHIP_DISTANCE);
            if (this.thrust) {
                rod.v.addScale(this.dir, dt * THRUST / SHIP_WEIGHT);
                var X = playerOffset;
                var F = this.dir.times(THRUST);
                var torque = X.cross(F);
                rod.va += dt * torque / INERTIA;
            }
            rod.v.scale(FRICTION);
            rod.v.y += dt * G;
            rod.p.addScale(rod.v, dt);
            rod.p.x = (rod.p.x + _game.Game.levelImg.width) % _game.Game.levelImg.width;
            rod.a += rod.va;
            rod.dir = _vec.Vec2.fromAngle(rod.a);
            this.p = rod.p.plus(rod.dir.times(SHIP_DISTANCE));
            _game.Game.ball.p = rod.p.plus(rod.dir.times(-BALL_DISTANCE));
            this.v = rod.v;
        } else {
            if (this.thrust) this.v.addScale(this.dir, dt * THRUST / SHIP_WEIGHT);
            this.v.y += dt * G;
            this.p.addScale(this.v, dt);
            this.p.x = (this.p.x + _game.Game.levelImg.width) % _game.Game.levelImg.width;
        }
        return true;
    };
    Ship.prototype.damage = function (_friendly) {
        if (_friendly || this.shield) return true;
        this.die();
        return false;
    };
    Ship.prototype.kill = function () {
        if (this.rod) {
            this.rod.kill();
            this.rod.explode(); // required because rod isn't in Game.entities.
            this.rod = null;
            _game.Game.ball.kill();
        }
        _super.prototype.kill.call(this);
    };
    Ship.prototype.die = function () {
        this.dead = true;
    };
    Ship.prototype.activateShield = function (dt, wasAttaching) {
        var shield = false;
        var attaching = false;
        if (!this.rod) {
            if (_game.Game.ball.collide(this.p, CABLE_LENGTH)) {
                attaching = true;
                shield = true;
                var rodDir_1 = _game.Game.ball.p.minus(this.p);
                this.v.addScale(rodDir_1, dt * CABLE_FORCE);
            } else if (wasAttaching) {
                var rodDir = this.p.minus(_game.Game.ball.p).unit();
                var rod = this.rod = new _rod.Rod(this.p.minus(rodDir.times(SHIP_DISTANCE)), rodDir.angle());
                rod.dir = rodDir;
                rod.v = this.v.times(1 / 2);
                rod.va = -this.v.cross(rodDir) * dt;
                _game.Game.ball.invincible = false;
            }
        }
        if (!shield) {
            this.shield = true;
            this.fuel -= dt * SHIELD_FUEL_RATE;
        }
        return attaching;
    };
    Ship.prototype.fire = function (fire) {
        if (fire) {
            if (_game.Game.time - this.timeFire > 0.5) {
                this.timeFire = _game.Game.time;
                var p = this.p.plus(this.dir.times(this.r));
                var b = new _bullet.Bullet(p, this.dir.times(_bullet.BULLET_SPEED).plus(this.v));
                b.friendly = true;
                _game.Game.particles.push(b);
            }
        } else {
            this.timeFire = 0.25;
        }
    };
    return Ship;
}(_entity.Entity);
exports.Ship = Ship;

},{"./bullet":5,"./entity":9,"./game":12,"./rod":17,"./vec2":20}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Star = undefined;

var _vec = require('./vec2');

var _particle = require('./particle');

var _game = require('./game');

///// <reference path="particle.ts"/>
var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var STAR_LIFE = 1;
var STAR_RADIUS = 1;
var Star = /** @class */function (_super) {
    __extends(Star, _super);
    function Star(p) {
        var _this = _super.call(this, p, 0, new _vec.Vec2(0, 0)) || this;
        _this.time = _game.Game.time;
        return _this;
    }
    Star.prototype.draw = function (time) {
        var t = (time - this.time) / STAR_LIFE;
        t = 1 - abs(1 - 2 * t);
        var level = 192 * t;
        stroke(level, level, level);
        var d = t * 3;
        line(this.p.x - d, this.p.y, this.p.x + d, this.p.y);
        line(this.p.x, this.p.y - d, this.p.x, this.p.y + d);
    };
    Star.prototype.move = function (_dt) {
        return _game.Game.time - this.time < STAR_LIFE;
    };
    return Star;
}(_particle.Particle);
exports.Star = Star;

},{"./game":12,"./particle":15,"./vec2":20}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Vec2 = /** @class */function () {
    function Vec2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.toString = function () {
        return this.x.toFixed(2) + "," + this.y.toFixed(2);
    };
    Vec2.fromAngle = function (a, r) {
        if (r === void 0) {
            r = 1;
        }
        return new Vec2(r * cos(a), r * sin(a));
    };
    Vec2.prototype.angle = function () {
        return atan2(this.y, this.x);
    };
    Vec2.prototype.clone = function () {
        return new Vec2(this.x, this.y);
    };
    Vec2.prototype.add = function (other) {
        this.x += other.x;
        this.y += other.y;
    };
    Vec2.prototype.addScale = function (other, scale) {
        this.x += other.x * scale;
        this.y += other.y * scale;
    };
    Vec2.prototype.sub = function (other) {
        this.x -= other.x;
        this.y -= other.y;
    };
    Vec2.prototype.scale = function (scale) {
        this.x *= scale;
        this.y *= scale;
    };
    Vec2.prototype.plus = function (other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    };
    Vec2.prototype.plusScale = function (other, scale) {
        return new Vec2(this.x + other.x * scale, this.y + other.y * scale);
    };
    Vec2.prototype.minus = function (other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    };
    Vec2.prototype.times = function (scale) {
        return new Vec2(this.x * scale, this.y * scale);
    };
    Vec2.prototype.len = function () {
        return sqrt(this.x * this.x + this.y * this.y);
    };
    Vec2.prototype.unit = function () {
        return this.times(1 / this.len());
    };
    Vec2.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y;
    };
    Vec2.prototype.cross = function (other) {
        return this.x * other.y - this.y * other.x;
    };
    return Vec2;
}();
exports.Vec2 = Vec2;

},{}]},{},[14])


//# sourceMappingURL=bundle.js.map
