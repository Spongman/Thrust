///// <reference path="boxEntity.ts"/>
import { Vec2 } from './vec2';
import { BoxEntity } from './boxEntity';
import { Box } from './box';
import { TILE_SIZE, Game } from './game';

export class Fuel extends BoxEntity
{
	fuel = 3;
	refuelBox: Box;
	private readonly score = 150;

	constructor(p: Vec2, private ballColor: p5.Color, private color: p5.Color)
	{
		super(p, new Box(
			p.x + 8,
			p.y + 18,
			24, 15
		));

		this.refuelBox = new Box(
			p.x, p.y - 50,
			40, 80
		);
	}

	draw()
	{
		push();

		translate(this.p.x + TILE_SIZE / 2, this.p.y + TILE_SIZE);

		stroke(255, 255, 0);

		beginShape();
		vertex(-12, -8);
		bezierVertex(-10, -6, 10, -6, 12, -8);
		bezierVertex(13, -9, 13, -19, 12, -20);
		bezierVertex(10, -22, -10, -22, -12, -20);
		bezierVertex(-13, -19, -13, -9, -12, -8);
		endShape();

		stroke(this.ballColor);

		line(-6, -6, -8, 0);
		line(6, -6, 8, 0);

		stroke(this.color);

		// F
		line(-10, -10, -10, -18);
		line(-10, -14, -7, -14);
		line(-10, -18, -6, -18);

		// U
		line(-4, -18, -4, -11);
		line(-4, -10, -0, -10);
		line(-0, -18, -0, -11);

		// E
		line(2, -18, 2, -10);
		line(2, -18, 5, -18);
		line(2, -14, 5, -14);
		line(2, -10, 5, -10);

		// L
		line(7, -18, 7, -10);
		line(7, -10, 10, -10);

		pop();
	}

	damage(friendly: boolean)
	{
		if (friendly)
		{
			Game.score += this.score;
			this.kill();
		}
		return false;
	}
}
