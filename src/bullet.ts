/// <reference path="particle.ts"/>

class Bullet extends Particle
{
	friendly = false;

	constructor(p: Vec2, v: Vec2)
	{
		super(p, BULLET_RADIUS, v);
	}

	draw()
	{
		noStroke();
		fill(255);
		ellipse(this.p.x, this.p.y, BULLET_RADIUS * 2, BULLET_RADIUS * 2);
	}

	move(dt: number)
	{
		return super.move(dt) && !level.collidePoint(this.p, this.r);
	}

	collideEntities()
	{
		const p = this.p;
		const r = this.r;
		for (let iEntity = _entities.length - 1; iEntity >= 0; iEntity--)
		{
			const entity = _entities[iEntity];
			if (entity.collide(p, r))
				return entity;
		}
		return null;
	}
}
