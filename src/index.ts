
let RENDER_SCALE = 0.5;
	
const MAX_HEIGHT = TILE_SIZE * 15;

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


enum GameState
{
	START,
	PLAY,
	DEATH,
	OVER,
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
		case GameState.OVER:
			if (ship.fuel < 0)
				ship.fuel = 0;
			if (lives < 0)
				lives = 0;
			break;
	}
}

let timePrev: number;

let timeFire = 0;
let waitTime: number;

let paused: boolean = false;

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
	if (_entities.indexOf(ship) < 0)
		_entities.unshift(ship);

	ball.reset();
	ship.reset();
	ship.move(0);
	level.reactor.reset();

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
				attaching = ship.activateShield(dt, wasAttaching);

			ship.fire(keys[KEY_FIRE]);

			for (let iEntity = _entities.length - 1; iEntity >= 0; iEntity--)
			{
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

				if (ship.rod && ship.p.y < -MAX_HEIGHT)
				{
					score += 1000;
					if (level.reactor.life <= 0)
						score += 2000;

					currentLevel++;
					startLevel();
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
	var yl = borderh * TILE_SIZE - py * RENDER_SCALE;
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

	// draw header
	fill(255, 255, 255);
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
				stroke(255, 255, 255);
				fill(255, 255, 255);
				textSize(30);
				textAlign(CENTER);
				text(floor(reactor.timeExplode - time).toString(), width / 2, height / 4);
			}
			break;

		case GameState.START:
			fill(255, 255, 255);
			noStroke();
			textAlign(CENTER);
			textSize(16);
			text("thrust to start", 0, height / 2 + 110, width, height);

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
				if (--lives >= 0 && ship.fuel > 0)
					resetLevel();
				else
					setGame(GameState.OVER);
			}
			break;

		case GameState.OVER:
			textSize(30);
			fill(255, 255, 255);
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
	RENDER_SCALE = Math.min(width, height) / 400;
}

function setup()
{
	windowResized();
	stroke(255, 255, 255);
	fill(0, 0, 0);
	angleMode(DEGREES);

	timePrev = millis() / 1000.0;

	ball = new Ball(
		new Vec2(30, 30)
	);

	ship = new Ship(
		new Vec2(width / 2, -100),
		-90
	);

	initializeLevels();
	startLevel();
}
