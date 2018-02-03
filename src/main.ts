import { Ball } from "./ball";
import { Ship } from "./ship";
import { Bullet } from "./bullet";
import { Star } from "./star";
import { Vec2 } from "./vec2";
import { Level, MAX_HEIGHT, borderw, borderh } from "./level";
import { Fuel } from "./fuel";
import { Checkpoint } from "./checkpoint";
import { Entity } from "./entity";
import { Game, TILE_SIZE } from './game';
import { Explosion } from "./explosion";
///// <reference path="level.ts"/>

let RENDER_SCALE = 0.5;
let bonus: number;
let font: p5.Font;
let fontHeight: number;

const KEY_LEFT = 'Z'.charCodeAt(0);
const KEY_RIGHT = 'X'.charCodeAt(0);
const KEY_FIRE = 13;//ENTER;
const KEY_THRUST = 16;//SHIFT;
const KEY_SHIELD = ' '.charCodeAt(0);

const instrs = [
	"Z, X : ROTATE",
	"ENTER : FIRE",
	"SPACE : SHIELD / TRACTOR",
	"SHIFT : THRUST",
];

enum GameState
{
	START,
	PLAY,
	DEATH,
	OVER,
	ORBIT,
	DESTROYED,
}

let gameState = GameState.START;
function setGame(state: GameState)
{
	if (gameState === state)
		return;

	gameState = state;
	switch (gameState)
	{
		case GameState.DEATH:
		case GameState.ORBIT:
		case GameState.DESTROYED:
		case GameState.OVER:
			if (Game.ship.fuel < 0)
				Game.ship.fuel = 0;
			if (Game.lives < 0)
				Game.lives = 0;
			break;
	}
}

const START_LEVEL = 0;
const THRUST_FUEL_RATE = 1 / 9;
const REFUEL_RATE = 3;
const TURN_SPEED = 275;

let timePrev: number;

let waitTime: number;

//let paused: boolean = false;

let wasAttaching: boolean;


export let currentLevel = START_LEVEL;


const keys: { [key: number]: boolean } = {};
window['keyPressed'] = function () { keys[+keyCode] = true; }
window['keyReleased'] = function () { keys[+keyCode] = false; }

function newGame()
{
	Game.ball = new Ball(color(255));
	Game.ship = new Ship();

	Game.score = 0;
	Game.lives = 3;

	currentLevel = START_LEVEL;
	startLevel();
}

function startLevel()
{
	Game.entities.length = 0;
	Game.entities.push(Game.ship, Game.ball);

	Game.level = Level.levels[currentLevel];
	const levelInfo = Game.level.load(Game.entities);
	Game.levelImg = levelInfo.image;

	Game.ball.ballColor = Game.level.ballColor;

	resetLevel();
}

function resetLevel()
{
	timePrev = millis() / 1000.0;

	Game.entities.remove(Game.ship);
	Game.entities.remove(Game.ball);
	Game.entities.remove(Game.level.reactor);
	Game.entities.push(Game.ship, Game.ball, Game.level.reactor);

	let level = Level.levels[currentLevel];

	Game.ball.reset(level.ballPos);
	Game.ship.reset();
	Game.ship.move(0);
	level.reactor.reset();

	wasAttaching = false;

	bonus = 0;
	setGame(GameState.START);
}

let starSum = 0;

window['draw'] = function ()
{
	const ship = Game.ship;
	const level = Game.level;
	const time = Game.time = millis() / 1000.0;
	const dt = Game.time - timePrev;
	timePrev = Game.time;


	if (ship.dead)
	{
		ship.dead = false;

		ship.kill();
		waitTime = Game.time + 1.5;
		setGame(GameState.DEATH);
	}

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
				attaching = ship.activateShield(dt, wasAttaching);

			ship.fire(keys[KEY_FIRE]);

			for (let iEntity = Game.entities.length - 1; iEntity >= 0; iEntity--)
			{
				if (iEntity >= Game.entities.length)
					continue;	// handle when multiple entries are removed (eg ship & ball)

				const entity = Game.entities[iEntity];
				if (entity !== ship || gameState === GameState.PLAY)
				{
					if (entity.move(dt) === false)
					{
						Game.entities.removeAt(iEntity);
						continue;
					}
				}

				if (gameState === GameState.PLAY)
				{
					if (entity.solid)
					{
						if (entity !== ship && entity.collide(ship.p, ship.r) ||
							entity !== Game.ball && entity.collide(Game.ball.p, Game.ball.r))
						{
							ship.die();
							continue;
						}

						if (ship.shield &&
							entity instanceof Fuel &&
							entity.refuelBox.collide(ship.p, 0))
						{
							const df = Math.min(entity.fuel, dt * REFUEL_RATE);
							entity.fuel -= df;
							ship.fuel += df;
							ship.refuel = true;
							if (entity.fuel <= 0)
							{
								Game.entities.removeAt(iEntity);
								Game.score += 300;
								continue;
							}
						}
					}
					else if (entity instanceof Checkpoint)
					{
						if (entity.collide(ship.p, ship.r))
						{
							Game.entities.removeAt(iEntity);
							level.checkpointPos = entity.p;
							continue;
						}
					}
				}
			}

			if (gameState === GameState.PLAY)
			{
				ship.thrust = keys[KEY_THRUST] && ship.p.y > -MAX_HEIGHT && ship.fuel > 0;
				if (ship.thrust)
					ship.fuel = Math.max(0, ship.fuel - dt * THRUST_FUEL_RATE);

				if (level.collideEntity(ship) ||
					level.collideEntity(Game.ball))
				{
					ship.die();
				}

				if (ship.p.y < -MAX_HEIGHT)
				{
					if (ship.rod)
					{
						bonus += 2000;

						if (level.reactor.life <= 0)
							bonus += 2000;
					}

					waitTime = time + 3;
					setGame(GameState.ORBIT);
				}

				if (level.reactor.timeExplode && time > level.reactor.timeExplode)
				{
					for (let iEntity = Game.entities.length - 1; iEntity >= 0; iEntity--)
						if (iEntity <= Game.entities.length)
							Game.entities[iEntity].kill();

					waitTime = time + 3;
					setGame(GameState.DESTROYED);
				}
			}
			else if (gameState === GameState.START)
			{
				if (keys[KEY_THRUST])
					setGame(GameState.PLAY);
			}

			wasAttaching = attaching;

			break;
	}

	if (gameState === GameState.ORBIT)
	{
		background(0, 0, 0);
	}
	else
	{
		// move particles
		for (let iParticle = Game.particles.length - 1; iParticle >= 0; iParticle--)
		{
			const particle = Game.particles[iParticle];
			if (particle.move(dt) === false)
			{
				Game.particles.removeAt(iParticle);
				continue;
			}

			const entity = particle.collideEntities();
			if (entity)
			{
				Game.particles.removeAt(iParticle);

				if (gameState === GameState.PLAY &&
					particle instanceof Bullet &&
					entity.damage(particle.friendly))
				{
					Explosion.create(particle.p, 0, 4);
				}
			}
		}

		const px = ship.p.x;
		const py = ship.p.y;

		const sw = width / RENDER_SCALE;
		const sh = height / RENDER_SCALE;

		noStroke();

		// draw sky

		var yl = height / 2 - py * RENDER_SCALE + 1;
		if (yl > 0)
		{
			fill(0, 0, 0);
			rect(0, 0, width, yl);

			// add stars
			starSum += random(width * yl) / 5000000;
			while (starSum > 1)
			{
				starSum -= 1;

				const syMin = py - sh / 2;
				const syMax = Math.min(0, py + sh / 2);

				const sy = random(syMin, syMax);
				const sx = px + random(-1, 1) * sw / 2;
				const star = new Star(new Vec2(sx, sy));
				Game.particles.push(star);
			}
		}

		push();
		translate(width / 2, height / 2);
		scale(RENDER_SCALE, RENDER_SCALE);
		translate(- px, - py);

		// draw level
		image(Game.levelImg, 0, 0);
		if (px < width / 2)
			image(Game.levelImg, -Game.levelImg.width, 0);
		else if (px > Game.levelImg.width - width / 2)
			image(Game.levelImg, Game.levelImg.width, 0);

		// draw particles
		strokeWeight(0.25);
		for (const particle of Game.particles)
			particle.draw(time);

		// draw entities
		stroke(255, 255, 255);
		strokeWeight(1.3);
		fill(0, 0, 0);
		for (const entity of Game.entities)
		{
			if (Math.abs(entity.p.x - px) <= sw / 2 + TILE_SIZE &&
				Math.abs(entity.p.y - py) <= sh / 2 + TILE_SIZE)
			{
				entity.draw(time);
			}
		}

		// draw rod
		stroke(level.color);
		if (ship.rod)
			ship.rod.draw();
		else if (attaching)
			line(ship.p.x, ship.p.y, Game.ball.p.x, Game.ball.p.y);

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
	text("" + Game.score, width - fontHeight / 2, fontHeight * 3 / 2);

	textAlign(CENTER, TOP);
	text("LIVES", width / 2, fontHeight / 2);
	text("" + Game.lives, width / 2, fontHeight * 3 / 2);

	switch (gameState)
	{
		case GameState.PLAY:

			const reactor = level.reactor;
			if (reactor && reactor.timeExplode > time)
			{
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

			if (Game.score === 0)
			{
				text("RESCUE THE POD", 0, height * 2 / 3 - fontHeight, width, height);
				text("DESTROY THE REACTOR", 0, height * 2 / 3 + 0, width, height);
				text("ESCAPE TO ORBIT", 0, height * 2 / 3 + fontHeight, width, height);

				textAlign(LEFT, TOP);
				for (let i = 0; i < instrs.length; i++)
				{
					const it = instrs[i];
					const mt = textWidth(it.substr(0, it.indexOf(':') + 1));
					text(it, width / 2 - mt, height / 3 + (i - instrs.length * 2 / 3) * fontHeight, width, height);
				}
			}
			break;

		case GameState.DEATH:
			if (time > waitTime && !keys[KEY_THRUST])
			{
				if (--Game.lives >= 0 && ship.fuel > 0)
					resetLevel();
				else
				{
					waitTime = time + 2;
					setGame(GameState.OVER);
				}
			}
			break;

		case GameState.OVER:
			fill(255, 255, 255);
			textAlign(CENTER, TOP);
			text("GAME OVER", width / 2, height / 3);

			if (time > waitTime)
			{
				text("THRUST TO START", 0, height * 2 / 3 + fontHeight * 2, width, height);
				if (keys[KEY_THRUST])
				{
					newGame();
				}
			}
			break;

		case GameState.ORBIT:

			noStroke();
			textAlign(CENTER, TOP);

			let nextLevel = ship.rod || level.reactor.life <= 0;
			if (!nextLevel)
			{
				fill(level.ballColor);
				text("MISSION INCOMPLETE", 0, height / 3, width, height);
			}
			else
			{
				if (level.reactor.life <= 0)
				{
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

			if (time > waitTime && !keys[KEY_THRUST])
			{
				if (nextLevel)
					++currentLevel;
				startLevel();
			}
			break;

		case GameState.DESTROYED:
			if (time > waitTime && !keys[KEY_THRUST])
				startLevel();
			break;
	}
}


window['preload'] = function ()
{
	//p5['disableFriendlyErrors'] = true;
	font = loadFont("assets/supersimf.ttf");
}

window['windowResized'] = function ()
{
	pixelDensity(1);
	createCanvas(windowWidth, windowHeight);
	RENDER_SCALE = Math.min(width, height) / 400;
	textSize(Math.ceil(17 * RENDER_SCALE));
	fontHeight = Math.ceil(17 * RENDER_SCALE);
}

window['setup'] = function ()
{

	Entity.createExplosion = Explosion.create;
	windowResized();

	textFont(font);

	stroke(255, 255, 255);
	fill(0, 0, 0);
	angleMode(DEGREES);

	Level.initializeLevels(width, height);

	newGame();
}
