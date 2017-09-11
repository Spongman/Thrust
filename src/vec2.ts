
class Vec2
{
	constructor(public x: number, public y: number)
	{
	}

	toString()
	{
		return this.x.toFixed(2) + "," + this.y.toFixed(2);
	}

	static fromAngle(a: number, r = 1)
	{
		return new Vec2(r * cos(a), r * sin(a));
	}

	angle()
	{
		return atan2(this.y, this.x);
	}

	clone()
	{
		return new Vec2(this.x, this.y);
	}

	add(other: Vec2)
	{
		this.x += other.x;
		this.y += other.y;
	}

	addScale(other: Vec2, scale: number)
	{
		this.x += other.x * scale;
		this.y += other.y * scale;
	}

	sub(other: Vec2)
	{
		this.x -= other.x;
		this.y -= other.y;
	}

	scale(scale: number)
	{
		this.x *= scale;
		this.y *= scale;
	}


	plus(other: Vec2)
	{
		return new Vec2(
			this.x + other.x,
			this.y + other.y
		);
	}

	minus(other: Vec2)
	{
		return new Vec2(
			this.x - other.x,
			this.y - other.y
		);
	}

	times(scale: number)
	{
		return new Vec2(
			this.x * scale,
			this.y * scale
		);
	}

	len()
	{
		return sqrt(this.x * this.x + this.y * this.y);
	}

	unit()
	{
		return this.times(1 / this.len());
	}

	dot(other: Vec2)
	{
		return this.x * other.x + this.y * other.y;
	}

	cross(other: Vec2)
	{
		return this.x * other.y - this.y * other.x;
	}
}
