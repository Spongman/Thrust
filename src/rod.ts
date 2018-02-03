///// <reference path="entity.ts"/>
import { Vec2 } from './vec2';
import { Entity } from './entity';
import { Game, TILE_SIZE } from './game';
import { Explosion } from './explosion';

export class Rod extends Entity
{
	va = 0;
	v = new Vec2(0, 0);
	dir: Vec2 = new Vec2(0, 0);

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
		line(Game.ship.p.x, Game.ship.p.y, Game.ball.p.x, Game.ball.p.y);
	}

	explode()
	{
		const cr = 20;
		for (let i = 0; i < cr; i++)
		{
			const rp = Game.ship.p.times(i / cr).plus(Game.ball.p.times(1 - i / cr));
			Explosion.create(rp, 3, 1);
		}
	}
}
