///// <reference path="particle.ts"/>
import { Vec2 } from './vec2';
import { Particle } from './particle';
import { Game } from './game';


const EXPLOSION_RADIUS = 1.5;
export class Explosion extends Particle
{
	private readonly time: number;

	constructor(p: Vec2, v: Vec2, public readonly color: p5.Color, public readonly life: number)
	{
		super(p, EXPLOSION_RADIUS, v);
		this.time = Game.time;
	}

	draw(time: number)
	{
		noStroke();
		const t = (time - this.time) / this.life;
		fill(this.color, 255 * (1 - t * t));
		ellipse(this.p.x, this.p.y, this.r * 2, this.r * 2);
	}

	move(dt: number)
	{
		this.v.scale(0.95);

		return super.move(dt) &&
			(Game.time - this.time < this.life) &&
			!Game.level.collidePoint(this.p, this.r);
	}

	static create(p: Vec2, r: number, c: number) {
		const particles = Game.particles;
		for (let i = 0; i < c; i++)
		{
			const dir = Vec2.fromAngle(random() * 360);
			const ex = new Explosion(
				p.plus(dir.times(r * random())),
				dir.times(random(5, 150)),
				[255, random(255), 0],
				0.25 + random() * 0.55
			);
      particles.push(ex);
    }
  }
}
