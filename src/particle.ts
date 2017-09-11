/// <reference path="entity.ts"/>

abstract class Particle extends Entity
{
	constructor(p: Vec2, r: number, public v: Vec2)
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
}
