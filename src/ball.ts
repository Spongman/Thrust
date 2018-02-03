/////// <reference path="entity.ts"/>
/////// <reference path="ship.ts"/>

export const BALL_RADIUS = 10;

import { Vec2 } from './vec2';
import { Entity } from './entity';
import { Game } from './game';

var i = 3;

export class Ball extends Entity
{
	invincible = true;

	constructor(public ballColor: p5.Color)
	{
		super(new Vec2(0, 0), BALL_RADIUS);
	}

	reset(pos: Vec2)
	{
		this.invincible = true;
		this.p = pos;
	}

	draw()
	{
		noFill();
		stroke(this.ballColor);
		ellipse(this.p.x, this.p.y, BALL_RADIUS * 2, BALL_RADIUS * 2);
	}

	damage(_friendly: boolean)
	{
		if (!this.invincible)
			Game.ship.die();
		return false;
	}
}
