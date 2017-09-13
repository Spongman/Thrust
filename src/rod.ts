/// <reference path="entity.ts"/>

class Rod extends Entity
{
	va = 0;
	v = new Vec2(0, 0);
	dir: Vec2;

	constructor(p: Vec2, public a: number)
	{
		super(p, 0);
	}

	reset()
	{
		this.p = new Vec2(width / 2 + 2 * TILE_SIZE, -2 * TILE_SIZE);
		this.v = new Vec2(0, 0);
		this.a = -90;
		this.va = 0;
	}

	draw()
	{
		stroke(level.color);
		line(ship.p.x, ship.p.y, ball.p.x, ball.p.y);
	}

	explode()
	{
		const cr = 20;
		for (let i = 0; i < cr; i++)
		{
			const rp = ship.p.times(i / cr).plus(ball.p.times(1 - i / cr));
			Particle.createExplosion(rp, 5, 1);
		}
	}
}
