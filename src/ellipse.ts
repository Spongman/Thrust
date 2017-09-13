
class Ellipse
{
	private readonly cosa: number;
	private readonly sina: number;

	constructor(public readonly p: Vec2, public readonly d: Vec2, public readonly a: number)
	{
		this.cosa = cos(a);
		this.sina = sin(a);
	}

	collide(p: Vec2, r: number)
	{
		const dx = p.x - this.p.x;
		const dy = p.y - this.p.y;
		const a = (this.cosa * dx + this.sina * dy) / (this.d.x + r);
		const b = (this.sina * dx - this.cosa * dy) / (this.d.y + r);

		return a * a + b * b <= 1 / 4;
	}
}
