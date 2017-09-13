/// <reference path="particle.ts"/>

class Star extends Particle
{
	private readonly time: number;

	constructor(p: Vec2)
	{
		super(p, 0, new Vec2(0, 0));
		this.time = time;
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
		return (time - this.time) < STAR_LIFE;
	}
}
