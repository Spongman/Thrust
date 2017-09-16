/// <reference path="boxEntity.ts"/>

class Reactor extends BoxEntity
{
	invincible = true;
	private timeSmoke = 0;
	timeExplode = 0;
	life = REACTOR_LIFE;

	constructor(p: Vec2)
	{
		super(p, new Box(
			p.x + 6, p.y + 13,
			31, 17
		));
	}

	draw(time: number)
	{
		if (this.timeExplode)
		{
			const timeExplode = (this.timeExplode - time) * 2;
			if (timeExplode - Math.trunc(timeExplode) > 0.5)
				return;
		}

		push();
		translate(this.p.x, this.p.y);

		stroke(0, 255, 0);

		ellipse(20, 22, 30, 24);

		fill(0);
		stroke(level.ballColor);

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

		stroke(level.color);

		noFill();
		beginShape();
		vertex(6, 40);
		vertex(6, 33);
		vertex(9, 33);
		vertex(9, 40);
		endShape();

		pop();
	}

	move(dt: number)
	{
		if (time > this.timeSmoke && !this.isDamaged())
		{
			this.timeSmoke = time + random(0.3, 0.4);

			const grey = random(192, 255);

			Particle.particles.push(new Explosion(
				this.p.plus(new Vec2(30, 8)),
				new Vec2(0, -60),
				[grey, grey, grey],
				random(0.65, 0.85)
			));
		}

		if (this.life > 0)
			this.life = Math.min(REACTOR_LIFE, this.life + dt * REACTOR_HEAL);

		return true;
	}

	damage(_friendly: boolean)
	{
		if (this.life > 0)
		{
			this.life -= 1;

			if (this.life < 0)
				this.timeExplode = time + 10;
		}
		return true;
	}

	isDamaged()
	{
		return this.life < 10;
	}

	reset()
	{
		this.life = REACTOR_LIFE
		this.timeExplode = 0;
	}
}
