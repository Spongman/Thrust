/// <reference path="entity.ts"/>

abstract class Particle extends Entity
{
	constructor(p: Vec2, r: number, public readonly v: Vec2)
	{
		super(p, r);
	}

	move(dt: number)
	{
		const p = this.p;
		p.addScale(this.v, dt);

		return (abs(p.x - ship.p.x) < width &&
			abs(p.y - ship.p.y) < width);
	}

	collideEntities(): Entity | null { return null; }

	abstract draw(time: number): void;

	static particles = <Particle[]>[];

	static createExplosion(p: Vec2, r: number, c: number)
	{
		const particles = Particle.particles;
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

