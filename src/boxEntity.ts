///// <reference path="entity.ts"/>
import { Vec2 } from './vec2';
import { Box } from './box';
import { Entity, EXPLOSION_DENSITY } from './entity';
import { Explosion } from './explosion';

export abstract class BoxEntity extends Entity
{
	constructor(p: Vec2, public readonly box: Box)
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
				Explosion.create(new Vec2(x, y), 0, 1);
		}
	}

}
