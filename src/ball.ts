/// <reference path="entity.ts"/>

class Ball extends Entity
{
	invincible: boolean;

	constructor(p: Vec2)
	{
		super(p, BALL_RADIUS);
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
