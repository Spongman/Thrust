import { Vec2 } from './vec2';
import { Entity } from './entity';
import { Reactor } from './reactor';
import { Enemy } from './enemy';
import { Base } from './base';
import { Checkpoint } from './checkpoint';
import { Fuel } from './fuel';
import { BALL_RADIUS } from './ball';
import { Game, TILE_SIZE } from './game';

const LAND_GAP = 40 / 8;
const LAND_THICKNESS = 2;

export const MAX_HEIGHT = TILE_SIZE * 15;
export var borderw: number;
export var borderh: number;


const SQRT5 = Math.sqrt(5);


export class Level
{
	reactor: Reactor = null!;
	ballPos: Vec2 = null!;
	checkpointPos: Vec2 = null!;

	constructor(
		public readonly color: p5.Color,
		public readonly ballColor: p5.Color,
		public readonly startPos: Vec2,
		public readonly lines: string[])
	{
	}

	load(entities: Entity[])
	{
		const lines = this.lines;
		const lh = lines.length;
		let lw = 0;
		for (const rgchLine of lines)
			lw = Math.max(lw, rgchLine.length);

		const bw = (lw + 2 * borderw) * TILE_SIZE;
		const bh = (lh + borderh) * TILE_SIZE;

		const gr = createGraphics(bw, bh, P2D);
		//const img = createImage(bw, bh);//, RGB);
		//img.sourceImg = gr.externals.canvas;
		//img.remote = true;

		this.checkpointPos = new Vec2((borderw + 0.5) * TILE_SIZE, 0).plusScale(Game.level.startPos, TILE_SIZE);

		//gr.beginDraw();
		gr.background(0);
		gr.strokeWeight(LAND_THICKNESS);
		gr.stroke(this.color);

		for (let iLine = 0; iLine < lines.length; iLine++)
		{
			const rgchLine = lines[iLine];

			for (let ich = 0; ich < rgchLine.length; ich++)
			{
				const p = new Vec2(
					(borderw + ich) * TILE_SIZE,
					iLine * TILE_SIZE
				);

				let entity: Entity | null = null;

				const ch = rgchLine[ich];
				switch (ch)
				{
					case 'a':
						entity = this.reactor = new Reactor(p, this.ballColor, this.color);
						break;
					case 'b':
						entity = new Fuel(p, this.ballColor, this.color);
						break;
					case 'c':
						entity = new Enemy(p, 0);
						break;
					case 'd':
						entity = new Enemy(p, 1);
						break;
					case 'e':
						entity = new Enemy(p, 2);
						break;
					case 'f':
						entity = new Enemy(p, 3);
						break;
					case 'g':
						entity = new Base(p);
						this.ballPos = new Vec2(
							(borderw + ich + 0.5) * TILE_SIZE,
							iLine * TILE_SIZE + TILE_SIZE - 18 - BALL_RADIUS
						);
						break;
					case 'k':
						entity = new Checkpoint(p);
						break;
				}

				if (entity)
					entities.push(entity);
			}

			for (let y = 0; y < TILE_SIZE; y += LAND_GAP)
			{
				let lx = -10000;
				let ly = iLine * TILE_SIZE + y;

				let land = rgchLine[0] === '1';
				for (let ich = 0; ich < rgchLine.length; ich++)
				{
					let end;
					let start;

					const ch = rgchLine[ich];
					switch (ch)
					{
						default:
						case '0':
							end = 0;
							start = TILE_SIZE;
							break;
						case '1':
							start = 0;
							end = TILE_SIZE;
							break;
						case '2':
							start = 0;
							end = 2 * y;
							break;
						case '3':
						case 'c':
							start = 0;
							end = 2 * y - TILE_SIZE;
							break;
						case '4':
						case 'd':
							start = TILE_SIZE * 2 - 2 * y;
							end = TILE_SIZE;
							break;
						case '5':
							start = TILE_SIZE - 2 * y;
							end = TILE_SIZE;
							break;
						case '6':
							start = 0;
							end = TILE_SIZE * 2 - 2 * y;
							break;
						case '7':
						case 'e':
							start = 0;
							end = TILE_SIZE - 2 * y;
							break;
						case '8':
						case 'f':
							start = 2 * y;
							end = TILE_SIZE;
							break;
						case '9':
							start = 2 * y - TILE_SIZE;
							end = TILE_SIZE;
							break;
					}

					const x = (borderw + ich) * TILE_SIZE;

					if (start < 0) { start = 0; }
					if (end > TILE_SIZE) { end = TILE_SIZE; }

					if (land)
					{
						if (start > 0)
						{
							gr.line(lx, ly, x - 1, ly);

							if (start < TILE_SIZE)
								lx = x + Math.min(TILE_SIZE, start);
							else
								land = false;
						}
						else if (end < TILE_SIZE)
						{
							gr.line(lx, ly, x + Math.max(0, end) - 1, ly);
							land = false;
						}
					}
					else if (end > start)
					{
						if (start >= 0 && start < TILE_SIZE)
						{
							land = true;
							lx = x + Math.min(TILE_SIZE, start);
						}
					}
				}

				if (land)
					gr.line(lx, ly, 10000, ly);
			}

			for (let y = 0; y < TILE_SIZE * borderh; y += LAND_GAP)
			{
				const ly = lh * TILE_SIZE + y;
				gr.line(-1000, ly, 10000, ly);
			}
		}

		//gr.endDraw();

		return {
			entities,
			image: <p5.Image><any>gr
		}
	}

	collidePoint(p: Vec2, r: number, offset?: Vec2)
	{
		const lines = this.lines;

		let mx = Math.floor(p.x / TILE_SIZE);
		let my = Math.floor(p.y / TILE_SIZE);

		if (offset)
		{
			mx += offset.x;
			my += offset.y;
		}

		const x = p.x - mx * TILE_SIZE;
		const y = p.y - my * TILE_SIZE;

		mx -= borderw;

		if (my < 0) { return false; }
		if (my >= lines.length) { return true; }

		const line = lines[my];
		if (mx < 0) { mx = 0; }
		else if (mx >= line.length) { mx = line.length - 1; }

		switch (line[mx])
		{
			default:
			case '0':
				return false;
			case '1':
				return true;
			case '2':
				return (y + r * SQRT5 / 2 > x / 2);
			case '3':
			case 'c':
				return (y + r * SQRT5 / 2 > TILE_SIZE / 2 + x / 2);
			case '4':
			case 'd':
				return (y + r * SQRT5 / 2 > TILE_SIZE - x / 2);
			case '5':
				return (y + r * SQRT5 / 2 > TILE_SIZE / 2 - x / 2);
			case '6':
				return (y - r * SQRT5 / 2 < TILE_SIZE - x / 2);
			case '7':
			case 'e':
				return (y - r * SQRT5 / 2 < TILE_SIZE / 2 - x / 2);
			case '8':
			case 'f':
				return (y - r * SQRT5 / 2 < x / 2);
			case '9':
				return (y - r * SQRT5 / 2 < TILE_SIZE / 2 + x / 2);
		}
	}

	collideEntity(entity: Entity)
	{
		const p = entity.p;
		const r = entity.r;
		const px = (p.x + TILE_SIZE * 1000) % TILE_SIZE;
		const py = (p.y + TILE_SIZE * 1000) % TILE_SIZE;

		const offset = new Vec2(0, 0);

		for (
			let mx = Math.floor((px - r) / TILE_SIZE);
			mx <= Math.floor((px + r) / TILE_SIZE);
			mx += 1)
		{
			for (
				let my = Math.floor((py - r) / TILE_SIZE);
				my <= Math.floor((py + r) / TILE_SIZE);
				my += 1)
			{
				offset.x = mx;
				offset.y = my;

				if (this.collidePoint(p, r, offset))
					return true;
			}
		}

		return false;
	}

	static initializeLevels(width: number, height: number)
	{
		borderw = Math.ceil(width / TILE_SIZE / 2);
		borderh = Math.ceil(height / TILE_SIZE / 2);

		Level.levels = [
			new Level(
				color(255, 0, 0),
				color(0, 255, 0),
				new Vec2(5, -2),
				[
					"00000000000k000a0",
					"12300b00000000111",
					"11111112c000g0111",
				],
			),
			new Level(
				color(0, 255, 0),
				color(255, 0, 0),
				new Vec2(2, -2),
				[
					"0a000000000k0000000451123",
					"1112300000000000045111111",
					"1111123000000004511111111",
					"1111111230000451111111111",
					"1111111112000111111111111",
					"1111111111000111111111111",
					"1111111111000111111111111",
					"11111111110k0111111111111",
					"1111111111000911111111111",
					"11111111670000f9111111111",
					"1111116e00000000111111111",
					"1111110000000000111111111",
					"1111110000000045111111111",
					"11111123g00b4511111111111",
				]
			),
			new Level(
				color(0, 255, 255),
				color(0, 255, 0),
				new Vec2(10, -2),
				[
					"10000000000b00000000000",
					"11111111111111100000001",
					"1111111111111110000a001",
					"11111111111111100011111",
					"11111111111111100011111",
					"11111111111111100011111",
					"11111111111111100011111",
					"11111111111116e0k000001",
					"11111111111110000000001",
					"11111111111110000bbb0d1",
					"11111111111110000111111",
					"11111111111110000111111",
					"11111111111110000111111",
					"1111116e000000000111111",
					"11111100000000000111111",
					"1111110000000b000111111",
					"11111100000011111111111",
					"16e00000000011111111111",
					"100000k0000011111111111",
					"10000000b00011111111111",
					"100000d5111111111111111",
					"10000011111111111111111",
					"10000011111111111111111",
					"10000011111111111111111",
					"10000011111111111111111",
					"1230g011111111111111111",
				],
			),
			new Level(
				color(0, 255, 0),
				color(255, 0, 255),
				new Vec2(6, -2),
				[
					"1112300000001111111111",
					"1111123000001111111111",
					"1111111111001111111111",
					"1111111111001111111111",
					"1111111111001111111111",
					"1111111111001111111111",
					"1111111167001111111111",
					"1111116e00001111111111",
					"1111670000001111111111",
					"11670000k0001111111111",
					"1100000000001111111111",
					"1100000000001111111111",
					"1112c00111111111111111",
					"1111600111111111111111",
					"116e000891111111111111",
					"1700000008911111111111",
					"10000000000f9111111111",
					"1000000000000000000001",
					"100a000000000000k00001",
					"1111111112c000000000i1",
					"11111111111230000b0001",
					"1111111111111111111001",
					"1111111111111111111j01",
					"1111111111111111111001",
					"11111111111111111670i1",
					"1111111111111116e00001",
					"1111111111111670000001",
					"1111111111111000k00001",
					"1111111111111000000d51",
					"1111111111111230045111",
					"1111111111111110011111",
					"111111111111111g011111",
				]
			),
			new Level(
				color(255, 0, 0),
				color(255, 0, 255),
				new Vec2(5, -2),
				[
					"0000000k0000000000000",
					"111230000001111111111",
					"111112000001111111111",
					"1111110b0001111111111",
					"111111111001111111111",
					"111111111001111111111",
					"111111111001111111111",
					"111111111001111111111",
					"111111111001111111111",
					"111116e000k00f9111111",
					"111110000000000111111",
					"1111100000a0bb0111111",
					"111111100111111111111",
					"111111100111111111111",
					"111111100111111111111",
					"111111600011111111111",
					"11116700k011111111111",
					"100000000011111111111",
					"100000000011111111111",
					"10000b000d11111111111",
					"100011111111111111111",
					"100011111111111111111",
					"100089111111111111111",
					"100000891111111111111",
					"123000008911111111111",
					"111230000011111111111",
					"1111100k0011111111111",
					"111100000011111111111",
					"111100000000f91111111",
					"11112c0bb000001111111",
					"111111111000001111111",
					"111111111000000001111",
					"1111111110000000i1111",
					"1111111112c0bb0001111",
					"111111111111111001111",
					"111111111111111j01111",
					"111111111111111008911",
					"1111111111111110000f1",
					"11111111111111100k001",
					"111111111111111h00001",
					"111111111111111000041",
					"1111111111111113g4511",
					"111111111111111111111",
					"111111111111111111111",
					"111111111111111111111",
					"111111111111111111111",
				]
			),
			new Level(
				color(255, 255, 0),
				color(0, 255, 0),
				new Vec2(5, -2),
				[
					"0000000000000000000000000001111111111123000",
					"0451230045123000000045111001111111111111230",
					"1111110011111230004511111001111000000891111",
					"1111110011111111111111111009116000000001111",
					"1111110000000891111111111000000000000001111",
					"1111110000000001111111111000000000110001111",
					"1111112300000001111111111300000000110001111",
					"1111111111111001111111111111111111110001111",
					"1111111111111008111111111111111111670001111",
					"1111111111111000111111111111111167000001111",
					"1111111111111005111111111111111100000041111",
					"1111111111117001111111111111111100000011111",
					"1111111111110001111111111111111100450011111",
					"1111111111112008911111111111116700110011111",
					"1111111111111000089111111111670000110011111",
					"1111111111111000000891111167000000110011111",
					"1111111111111230000008916700000045110011111",
					"1111111111111112300000000000004511110011111",
					"1111111111111111123000000000451111700008111",
					"1111111111111111111234512345111111000000111",
					"1111111111111111111111111111111111000000111",
					"1111111111111111111111111111111111000000111",
				]
			)
		];
	}

	static levels: Level[];
}
