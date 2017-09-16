class Checkpoint extends Entity
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