
abstract class Entity
{
	refuelBox: Box;
	fuel: number;

	constructor(public p: Vec2, public r: number)
	{
	}

	collide(p: Vec2, r: number)
	{
		const dx = this.p.x - p.x;
		const dy = this.p.y - p.y;
		const rr = this.r + r;

		return dx * dx + dy * dy < rr * rr;
	}

	remove()
	{
		const index = entities.indexOf(this);
		if (index >= 0)
		{
			entities.removeAt(index);
			return true;
		}
		return false;
	}

	explode()
	{
		explode(this.p, this.r, 5 + this.r * this.r / EXPLOSION_DENSITY);
	}

	kill()
	{
		if (this.remove())
			this.explode();
	}

	abstract draw(time: number): void;
	move(_dt: number) { return true; }
	damage(_friendly: boolean) { return false; }
}
