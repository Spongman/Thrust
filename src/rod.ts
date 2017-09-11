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
			explode(rp, 5, 1);
		}
	}
}
