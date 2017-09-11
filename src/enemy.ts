/// <reference path="entity.ts"/>

class Enemy extends Entity
{
	sx: number;
	sy: number;
	ba: number;
	bp: Vec2;
	score: number;
	timeFire: number;
	ellipse: Ellipse;

	constructor(p: Vec2, type: number)
	{
		const sx = (type & 1) ? -1 : 1;
		const sy = (type & 2) ? -1 : 1;

		p = p.plus(new Vec2(20, 20 + sy * 10));

		super(p, 15);

		this.sx = sx;
		this.sy = sy;

		this.ba = atan2(-2 * this.sy, this.sx);
		const bd = Vec2.fromAngle(this.ba);

		this.bp = p.plus(bd.times(16));
		this.score = 750;

		this.timeFire = 0;

		this.ellipse = new Ellipse(
			p,
			new Vec2(40, 26),
			//new Vec2(1,1),
			this.sx * this.sy * SLOPE
		);
	}
	draw()
	{
		fill(0);
		stroke(level.ballColor);

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
	}

	move(_dt: number)
	{
		if (!level.reactor!.isDamaged() &&
			(!this.timeFire || time > this.timeFire))
		{
			this.timeFire = time + random(ENEMY_FIRE_MIN, ENEMY_FIRE_MAX);

			const av = (random(-95, 95) + random(-95, 95) + random(-95, 95)) / 3;
			const bd = Vec2.fromAngle(this.ba + av);
			const b = new Bullet(this.bp.clone(), bd.times(BULLET_SPEED));
			particles.push(b);
		}
		return true;
	}

	collide(p: Vec2, r: number)
	{
		return this.ellipse.collide(p, r);
	}

	damage(friendly: boolean)
	{
		if (friendly)
		{
			score += this.score;
			this.kill();
		}
		return false;
	}
}
