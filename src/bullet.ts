///// <reference path="particle.ts"/>
///// <reference path="level.ts"/>

import { Vec2 } from './vec2';
import { Particle } from './particle';
import { MAX_HEIGHT } from './level';
import { Entity } from './entity';
import { Game } from './game';

const BULLET_RADIUS = 1.5;
export const BULLET_SPEED = 250;

export class Bullet extends Particle
{
	friendly = false;

	constructor(p: Vec2, v: Vec2)
	{
		super(p, BULLET_RADIUS, v);
	}

	draw()
	{
		noStroke();
		fill(255, 255, 255);
		ellipse(this.p.x, this.p.y, BULLET_RADIUS * 2, BULLET_RADIUS * 2);
	}

	move(dt: number)
	{
		return super.move(dt) &&
			this.p.y > -MAX_HEIGHT &&
			!Game.level.collidePoint(this.p, this.r);
	}

	collideEntities()
	{
		const p = this.p;
		const r = this.r;
		for (let iEntity = Game.entities.length - 1; iEntity >= 0; iEntity--)
		{
			const entity = Game.entities[iEntity];
			if (entity.solid && entity.collide(p, r))
				return entity;
		}
		return null;
	}
}
