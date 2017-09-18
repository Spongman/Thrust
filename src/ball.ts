/// <reference path="entity.ts"/>

const BALL_RADIUS = 10;
const BALL_WEIGHT = 0.75;

/// <reference path="ship.ts"/>

class Ball extends Entity
{
	invincible = true;

	constructor(p: Vec2)
	{
		super(p, BALL_RADIUS);
	}

	reset()
	{
		this.invincible = true;
		this.p = level.ballPos;
	}

	draw()
	{
		noFill();
		stroke(level.ballColor);
		ellipse(this.p.x, this.p.y, BALL_RADIUS * 2, BALL_RADIUS * 2);
	}

	damage(_friendly: boolean)
	{
		if (ship.rod)
			die();
		return false;
	}
}

let ball: Ball;
