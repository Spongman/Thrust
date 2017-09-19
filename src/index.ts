
let RENDER_SCALE = 0.5;
let bonus: number;
let font: p5.Font;
let fontHeight: number;

const MAX_HEIGHT = TILE_SIZE * 15;

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
	switch(gameState)
	{
		case GameState.DEATH:
		case GameState.ORBIT:
		case GameState.DESTROYED:
		case GameState.OVER:
			if (ship.fuel < 0)
				ship.fuel = 0;
			if (lives < 0)
				lives = 0;
			break;
	}
}

let timePrev: number;

let waitTime: number;

//let paused: boolean = false;

let wasAttaching: boolean;

let lives = 3;


const keys: { [key: number]: boolean } = {};
function keyPressed() { keys[+keyCode] = true; }
function keyReleased() { keys[+keyCode] = false; }

function die()
{
	ship.kill();

	waitTime = time + 1.5;

	setGame(GameState.DEATH);
}

function newGame()
{
	ball = new Ball();
	ship = new Ship();

	score = 0;
	lives = 3;
	
	currentLevel = START_LEVEL;
	startLevel();
}

function startLevel()
{
	_entities.length = 0;
	_entities.push(ship, ball);

	level = levels[currentLevel];
	const levelInfo = level.load(_entities);
	levelImg = levelInfo.image;

	resetLevel();
}

function resetLevel()
{
	timePrev = millis() / 1000.0;
	
	_entities.remove(ship);
	_entities.remove(ball);
	_entities.remove(level.reactor);
	_entities.push(ship, ball, level.reactor);

	ball.reset();
	ship.reset();
	ship.move(0);
	level.reactor.reset();

	wasAttaching = false;

	bonus = 0;
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
				attaching = ship.activateShield(dt, wasAttaching);

			ship.fire(keys[KEY_FIRE]);

			for (let iEntity = _entities.length - 1; iEntity >= 0; iEntity--)
			{
				if (iEntity >= _entities.length)
					continue;	// handle when multiple entries are removed (eg ship & ball)

				const entity = _entities[iEntity];
				if (entity !== ship || gameState === GameState.PLAY)
				{
					if (entity.move(dt) === false)
					{
						_entities.removeAt(iEntity);
						continue;
					}
				}

				if (gameState === GameState.PLAY)
				{
					if (entity.solid)
					{
						if (entity !== ship && entity.collide(ship.p, ship.r) ||
							entity !== ball && entity.collide(ball.p, ball.r))
						{
							die();
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
								_entities.removeAt(iEntity);
								score += 300;
								continue;
							}
						}
					}
					else if (entity instanceof Checkpoint)
					{
						if (entity.collide(ship.p, ship.r))
						{
							_entities.removeAt(iEntity);
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
					level.collideEntity(ball))
				{
					die();
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
					for (let iEntity = _entities.length - 1; iEntity >= 0; iEntity--)
						_entities[iEntity].kill();

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

		// draw sky

		var yl = height/2 - py * RENDER_SCALE + 1;
		if (yl > 0)
		{
			fill(0, 0, 0);
			rect(0, 0, width, yl);

			// add stars
			if (random() < 0.1)
			{
				const sy = py + (random() * 2 - 1) * height / 2;
				if (sy < 0)
				{
					const sx = px + (random() * 2 - 1) * width / 2;
					const star = new Star(new Vec2(sx, sy));
					Particle.particles.push(star);
				}
			}		
		}

		push();
		translate(width / 2, height / 2);
		//scale(2, 2);
		scale(RENDER_SCALE, RENDER_SCALE);
		translate(- px, - py);

		// draw level
		image(levelImg, 0, 0);
		if (px < width / 2)
			image(levelImg, -levelImg.width, 0);
		else if (px > levelImg.width - width / 2)
			image(levelImg, levelImg.width, 0);

		// draw particles
		noStroke();
		strokeWeight(0.25);
		for (const particle of Particle.particles)
			particle.draw(time);

		// draw entities
		stroke(255, 255, 255);
		strokeWeight(1.3);
		fill(0, 0, 0);
		for (const entity of _entities)
			entity.draw(time);

		// draw rod
		stroke(level.color);
		if (ship.rod)
			ship.rod.draw();
		else if (attaching)
			line(ship.p.x, ship.p.y, ball.p.x, ball.p.y);

		pop();
	}

	// draw header

	fill(0, 0, 0, 64);
	rect(0, 0, width, fontHeight * 2 + fontHeight);

	fill(255, 255, 255);
	textAlign(LEFT, TOP);
	text("FUEL", fontHeight/2, fontHeight/2);
	text((ship.fuel * 100).toFixed(), fontHeight/2, fontHeight*3/2);

	textAlign(RIGHT, TOP);
	text("SCORE", width - fontHeight/2, fontHeight/2);
	text("" + score, width - fontHeight/2, fontHeight*3/2);

	textAlign(CENTER, TOP);
	text("LIVES", width / 2, fontHeight/2);
	text("" + lives, width / 2, fontHeight*3/2);

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

			if (score === 0)
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
				if (--lives >= 0 && ship.fuel > 0)
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
				text("MISSION", width/2-8, height / 3 + fontHeight*2, 0, height);
				textAlign(LEFT, TOP);
				text(ship.rod ? "COMPLETE" : "FAILED", width/2+8, height / 3 + fontHeight*2, 0, height);

				fill(255, 255, 0);
				textAlign(CENTER, TOP);
				text((currentLevel + 1).toString(), 0, height / 3 + fontHeight*2, width, height);
				text(ship.rod ? "BONUS " + bonus : "NO BONUS", 0, height / 3 + fontHeight*4, width, height);
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

function preload()
{
	font = loadFont("assets/supersimf.ttf");
}

function windowResized()
{
	createCanvas(windowWidth, windowHeight);
	RENDER_SCALE = Math.min(width, height) / 400;
	textSize(Math.ceil(17 * RENDER_SCALE));
	fontHeight = Math.ceil(17 * RENDER_SCALE);
}

function setup()
{
	windowResized();
	borderw = Math.ceil(width / TILE_SIZE / 2);
	borderh = Math.ceil(height / TILE_SIZE / 2);

	textFont(font);
	
	stroke(255, 255, 255);
	fill(0, 0, 0);
	angleMode(DEGREES);

	initializeLevels();

	newGame();
}
