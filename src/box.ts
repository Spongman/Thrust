
class Box
{
	constructor(public x: number, public y: number, public w: number, public h: number)
	{
	}

	collide(p: Vec2, r: number)
	{
		return (
			p.x + r > this.x &&
			p.x - r < this.x + this.w &&
			p.y + r > this.y &&
			p.y - r < this.y + this.h
		);
	}
}
