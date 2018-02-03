///// <reference path="particle.ts"/>

import { Vec2 } from './vec2';
import { Particle } from './particle';
import { Game } from './game';

const STAR_LIFE = 1;
const STAR_RADIUS = 1;

export class Star extends Particle
{
	private readonly time: number;

	constructor(p: Vec2)
	{
		super(p, 0, new Vec2(0, 0));
		this.time = Game.time;
	}

	draw(time: number)
	{
		let t = (time - this.time) / STAR_LIFE;
		t = 1 - abs(1 - 2 * t);
		const level = 192 * t;
		stroke(level, level, level);

		const d = t * 3;
		line(this.p.x - d, this.p.y, this.p.x + d, this.p.y);
		line(this.p.x, this.p.y - d, this.p.x, this.p.y + d);
	}

	move(_dt: number)
	{
		return (Game.time - this.time) < STAR_LIFE;
	}
}
