import { Vec2 } from './vec2';
import { Entity } from './entity';
import { TILE_SIZE } from './game';

export class Checkpoint extends Entity
{
	
	constructor(p: Vec2)
	{
		super(p, TILE_SIZE * 2);
		this.solid = false;
	}

	draw(_time: number)
	{
	}
}