/// <reference path="boxEntity.ts"/>
/// <reference path="level.ts"/>

class Base extends BoxEntity
{
	invicible = false;

	constructor(p: Vec2)
	{
		super(p, new Box(
			p.x + TILE_SIZE / 2 - 10, p.y + TILE_SIZE - 18,
			TILE_SIZE / 2, 18
		));
	}

	draw()
	{
		stroke(255, 255, 0);
		noFill();

		push();
		translate(this.p.x + TILE_SIZE / 2, this.p.y + TILE_SIZE);

		beginShape();

		vertex(-8, 0);
		vertex(-7, -2);
		vertex(-3, -3);
		vertex(-3, -12);
		vertex(-9, -14);
        vertex(-8, -18);
        bezierVertex(-4, -14, 4, -14, 8, -18);
		//vertex(-4, -16);
		//vertex(4, -16);
		vertex(8, -18);
		vertex(9, -14);
		vertex(3, -12);
		vertex(3, -3);
		vertex(7, -2);
		vertex(8, 0);

		endShape();
		pop();
	}
}
