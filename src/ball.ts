/// <reference path="entity.ts"/>

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
