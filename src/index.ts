/// <raeference path="../p5.global-mode.d.ts"/>

declare interface Array<T>
{
	removeAt(i: number): T;
}

const SHIP_WEIGHT = 1;
const BALL_WEIGHT = 1;
const G = 50;
const THRUST = 200;
const TURN_SPEED = 200;
const FRICTION = 1;//0.99;
const BULLET_SPEED = 250;
const START_LEVEL = 0;
const CABLE_FORCE = G / 40;
const ENEMY_FIRE_MIN = 1;
const ENEMY_FIRE_MAX = 4;
const REACTOR_LIFE = 10;
const REACTOR_HEAL = 1 / 4;

const BULLET_RADIUS = 1.5;
const BALL_RADIUS = 10;
const CABLE_LENGTH = 80;
const SHIP_RADIUS = 14.5;
const SHIELD_RADIUS = 18;
const TILE_SIZE = 40;
const LAND_GAP = 4;
const LAND_THICKNESS = 2;
const STAR_LIFE = 1;
const STAR_RADIUS = 1;
const MAX_HEIGHT = TILE_SIZE * 10;
const EXPLOSION_DENSITY = 8;

const TOTAL_WEIGHT = SHIP_WEIGHT + BALL_WEIGHT;
const BALL_FRACTION = SHIP_WEIGHT / TOTAL_WEIGHT;
const SHIP_FRACTION = BALL_WEIGHT / TOTAL_WEIGHT;
const BALL_DISTANCE = CABLE_LENGTH * BALL_FRACTION;
const SHIP_DISTANCE = CABLE_LENGTH * SHIP_FRACTION;

const INERTIA = SHIP_WEIGHT * SHIP_DISTANCE * SHIP_DISTANCE +
	BALL_WEIGHT * BALL_DISTANCE * BALL_DISTANCE;


const SQRT5 = Math.sqrt(5);
const SLOPE = Math.atan2(1, 2) * 360 / (2 * Math.PI);

const KEY_LEFT = 'Z'.charCodeAt(0);
const KEY_RIGHT = 'X'.charCodeAt(0);
const KEY_FIRE = 13;//ENTER;
const KEY_THRUST = 16;//SHIFT;
const KEY_SHIELD = ' '.charCodeAt(0);

const instrs = [
	"z, x : rotate",
	"enter : fire",
	"space : shield / tractor",
	"shift : thrust",
];

let borderw: number, borderh: number;


enum GameState
{
	START = "start",
	PLAY = "play",
	DEATH = "death",
	OVER = "over",
}

let gameState = GameState.START;
function setGame(state: GameState)
{
	gameState = state;
}

let time: number;
let timePrev: number;
let timeFire = 0;
let waitTime: number;

let level: Level;
let levelImg: p5.Image;
let currentLevel = START_LEVEL;

let ship: Ship;
let ball: Ball;
let wasAttaching: boolean;

let score = 0;
let lives = 3;

const _entities: Entity[] = [];

const keys: { [key: number]: boolean } = {};
function keyPressed() { keys[+keyCode] = true; }
function keyReleased() { keys[+keyCode] = false; }

function die()
{
	ship.kill();

	waitTime = time + 1.5;

	setGame(GameState.DEATH);
}

function resetLevel()
{
	_entities.length = 0;
	_entities.push(ship, ball);

	level = levels[currentLevel];
	const levelInfo = level.load(_entities);
	levelImg = levelInfo.image;

	ball.reset();
	ship.reset();
	ship.move(0);

	wasAttaching = false;

	setGame(GameState.START);
}

function draw()
{
	time = millis() / 1000.0;
	const dt = time - timePrev;
	timePrev = time;

	let attaching = false;

	switch (gameState)
	{
		case GameState.PLAY:
		case GameState.START:

			if (keys[KEY_LEFT])
				ship.rotate(-TURN_SPEED * dt);
			else if (keys[KEY_RIGHT])
				ship.rotate(TURN_SPEED * dt);

			ship.shield = false;
			ship.refuel = false;

			if (!!keys[KEY_SHIELD])
			{
				let shield = false;

				if (!ship.rod)
				{
					if (ball.collide(ship.p, CABLE_LENGTH))
					{
						attaching = true;
						shield = true;

						const rodDir = ball.p.minus(ship.p);
						ship.v.addScale(rodDir, dt * CABLE_FORCE);
					}
					else if (wasAttaching)
					{
						var rodDir = ship.p.minus(ball.p).unit();
						var rod = ship.rod = new Rod(
							ship.p.minus(rodDir.times(SHIP_DISTANCE)),
							rodDir.angle()
						);
						rod.dir = rodDir;
						rod.v = ship.v.times(1 / 2);
						rod.va = -ship.v.cross(rodDir) * dt;

						ball.invincible = false;
					}
				}

				if (!shield)
					ship.shield = true;
			}

			if (keys[KEY_FIRE])
			{
				if (time - timeFire > 0.5)
				{
					timeFire = time;
					const p = ship.p.plus(ship.dir.times(SHIP_RADIUS));
					const b = new Bullet(p, ship.dir.times(BULLET_SPEED).plus(ship.v));
					b.friendly = true;
					Particle.particles.push(b);
				}
			}
			else
			{
				timeFire = 0.25;
			}

			if (ship.rod)
				ship.rod.p.x = (ship.rod.p.x + levelImg.width) % levelImg.width;
			else
				ship.p.x = (ship.p.x + levelImg.width) % levelImg.width;

			for (let iEntity = _entities.length - 1; iEntity >= 0; iEntity--)
			{
				const entity = _entities[iEntity];
				if (entity.move)
				{
					if (entity !== ship || gameState === GameState.PLAY)
					{
						if (entity.move(dt) === false)
						{
							_entities.removeAt(iEntity);
							continue;
						}
					}
				}

				if (gameState === GameState.PLAY)
				{
					if (entity !== ship && entity.collide(ship.p, SHIP_RADIUS) ||
						entity !== ball && entity.collide(ball.p, BALL_RADIUS))
					{
						die();
					}

					if (ship.shield &&
						entity instanceof Fuel &&
						entity.refuelBox.collide(ship.p, 0))
					{
						const df = Math.min(entity.fuel, dt * 3);
						entity.fuel -= df;
						ship.fuel += df;
						ship.refuel = true;
						if (entity.fuel <= 0)
						{
							_entities.removeAt(iEntity);
							score += 300;
							continue;
						}
					}
				}
			}

			if (gameState === GameState.PLAY)
			{
				ship.thrust = keys[KEY_THRUST] && ship.p.y > -MAX_HEIGHT && ship.fuel > 0;
				if (ship.thrust)
					ship.fuel = Math.max(0, ship.fuel - dt / 3);

				if (level.collideCircle(ship.p, SHIP_RADIUS) ||
					level.collideCircle(ball.p, BALL_RADIUS))
				{
					die();
				}

				if (ship.rod && ship.p.y < -MAX_HEIGHT)
				{
					score += 1000;
					if (level.reactor.life <= 0)
						score += 2000;

					currentLevel++;
					resetLevel();
				}

				if (level.reactor.timeExplode && time > level.reactor.timeExplode)
				{
					for (let iEntity = _entities.length - 1; iEntity >= 0; iEntity--)
						_entities[iEntity].kill();

					waitTime = time + 1.5;
					setGame(GameState.DEATH);
				}
			}
			else if (gameState === GameState.START)
			{
				if (keys[KEY_THRUST])
					setGame(GameState.PLAY);
			}

			wasAttaching = attaching;

			break;

		case GameState.START:
			if (keys[KEY_THRUST])
				setGame(GameState.PLAY);
			break;
	}


	for (let iParticle = Particle.particles.length - 1; iParticle >= 0; iParticle--)
	{
		const particle = Particle.particles[iParticle];
		if (particle.move(dt) === false)
		{
			Particle.particles.removeAt(iParticle);
			continue;
		}

		const entity = particle.collideEntities();
		if (entity)
		{
			Particle.particles.removeAt(iParticle);

			if (gameState === GameState.PLAY &&
				particle instanceof Bullet &&
				entity.damage(particle.friendly))
			{
				Particle.createExplosion(particle.p, 0, 4);
			}
		}
	}

	const px = ship.p.x;
	const py = ship.p.y;

	if (py < height / 2 && random() < 0.1)
	{
		const sy = py + (random() * 2 - 1) * height / 2;
		if (sy < 0)
		{
			const sx = px + (random() * 2 - 1) * width / 2;
			const star = new Star(new Vec2(sx, sy));
			Particle.particles.push(star);
		}
	}


	background(0);
	push();
	translate(width / 2 - px, height / 2 - py);
	image(levelImg, 0, 0);

	if (px < width / 2)
		image(levelImg, -levelImg.width, 0);
	else if (px > levelImg.width - width / 2)
		image(levelImg, levelImg.width, 0);

	noStroke();
	strokeWeight(0.25);
	for (const particle of Particle.particles)
		particle.draw(time);

	stroke(255);
	strokeWeight(1.3);
	fill(0, 0, 0);

	if (ship.rod)
	{
		ship.rod.draw();
	}
	else if (attaching)
	{
		stroke(level.color);
		line(ship.p.x, ship.p.y, ball.p.x, ball.p.y);
	}

	for (const entity of _entities)
		entity.draw(time);

	pop();

	fill(255);
	textSize(14);
	textAlign(LEFT);
	text("fuel", 10, 20);
	text((ship.fuel * 100).toFixed(), 10, 35);

	textAlign(RIGHT);
	text("score", width - 10, 20);
	text("" + score, width - 10, 35);

	textAlign(CENTER);
	text("lives", width / 2, 20);
	text("" + lives, width / 2, 35);


	switch (gameState)
	{
		case GameState.PLAY:

			const reactor = level.reactor;
			if (reactor && reactor.timeExplode > time)
			{
				stroke(255);
				fill(255);
				textSize(30);
				textAlign(CENTER);
				text(floor(reactor.timeExplode - time).toString(), width / 2, height / 4);
			}
			break;

		case GameState.START:
			fill(255);
			noStroke();
			textAlign(CENTER);
			textSize(16);
			text("thrust to start", 0, height / 2 + 100, width, height);

			if (score === 0)
			{
				text("rescue the pod", 0, height / 2 + 50, width, height);
				text("destroy the reactor", 0, height / 2 + 66, width, height);
				text("escape to orbit", 0, height / 2 + 82, width, height);

				textAlign(LEFT);
				textSize(20);
				for (let i = 0; i < instrs.length; i++)
				{
					const it = instrs[i];
					const mt = textWidth(it.substr(0, it.indexOf(':') + 1));
					text(it, width / 2 - mt, 60 + i * 20, width, height);
				}
			}
			break;

		case GameState.DEATH:
			if (time > waitTime && !keys[KEY_THRUST])
			{
				if (--lives > 0 && ship.fuel > 0)
					resetLevel();
				else
					setGame(GameState.OVER);
			}
			break;

		case GameState.OVER:
			textSize(30);
			fill(255);
			textAlign(CENTER);
			text("game over", width / 2, height / 3);
			break;
	}
}

function windowResized()
{
	createCanvas(windowWidth, windowHeight);
	borderw = Math.ceil(width / TILE_SIZE / 2);
	borderh = Math.ceil(height / TILE_SIZE / 2);
}

function setup()
{
	createCanvas(windowWidth, windowHeight);
	stroke(255);
	fill(0);
	angleMode(DEGREES);

	borderw = Math.ceil(width / TILE_SIZE / 2);
	borderh = Math.ceil(height / TILE_SIZE / 2);

	timePrev = millis() / 1000.0;

	ball = new Ball(
		new Vec2(30, 30)
	);

	ship = new Ship(
		new Vec2(width / 2, -100),
		-90
	);

	initializeLevels();
	resetLevel();
}
