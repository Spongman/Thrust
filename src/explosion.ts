/// <reference path="particle.ts"/>

const EXPLOSION_RADIUS = 1.5;
class Explosion extends Particle
{
	time: number;
	constructor(p: Vec2, v: Vec2, public color: p5.Color, public life: number)
	{
		super(p, EXPLOSION_RADIUS, v);
		this.time = time;
	}
	draw(time: number)
	{
		noStroke();
		const t = (time - this.time) / this.life;
		const color = this.color;
		fill(color[0], color[1], color[2], 255 * (1 - t * t));
		ellipse(this.p.x, this.p.y, this.r * 2, this.r * 2);
	}
	move(dt: number)
	{
		this.v.scale(0.95);
		return super.move(dt) && (time - this.time < this.life);
	}
}
