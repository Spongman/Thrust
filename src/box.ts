import { Vec2 } from './vec2';

export class Box
{
	constructor(public readonly x: number, public readonly y: number, public readonly w: number, public readonly h: number)
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
