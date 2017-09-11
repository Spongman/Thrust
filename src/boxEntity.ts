/// <reference path="entity.ts"/>

abstract class BoxEntity extends Entity
{
	constructor(p: Vec2, public box: Box)
	{
		super(p, NaN);
	}

	collide(p: Vec2, r: number)
	{
		return this.box.collide(p, r);
	}

	explode()
	{
		const q = sqrt(EXPLOSION_DENSITY);
		for (let x = this.box.x; x < this.box.x + this.box.w; x += q)
		{
			for (let y = this.box.y; y < this.box.y + this.box.h; y += q)
				explode(new Vec2(x, y), 0, 1);
		}
	}
}
