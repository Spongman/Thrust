/// <reference path="entity.ts"/>

class Ship extends Entity
{
	rod: Rod | null = null;

	dir = new Vec2(0, 0);
	v = new Vec2(0, 0);
	thrust = false;
	shield = false;
	refuel = false;
	fuel = 10;
	
	constructor(p: Vec2, public a: number)
	{
		super(p, SHIP_RADIUS);

		this.rotateTo(a || 0);
	}

	reset()
	{
		this.p = level.startPos.clone();
		this.v = new Vec2(0, 0);
		this.rotateTo(-90);
		this.thrust = false;
		this.shield = false;

		this.rod = null;
	}

	draw()
	{
		fill(0);
		stroke(255, 255, 0);

		push();
		translate(this.p.x, this.p.y);

		if (this.refuel && random() < 0.5)
		{
			line(10, 20, 24, 60);
			line(-10, 20, -24, 60);
		}

		rotate(this.a + 90);

		if (this.shield && random() < 0.5)
			ellipse(0, -3, SHIELD_RADIUS * 2, SHIELD_RADIUS * 2);
		else {

			beginShape();
			vertex(0, -18);
			vertex(9, -1);
			vertex(13, 1);
			vertex(6, 11);
			vertex(3, 8);
			vertex(-3, 8);
			vertex(-6, 11);
			vertex(-13, 1);
			vertex(-9, -1);
			endShape(CLOSE);

			if (this.thrust && random() < 0.5)
			{
				line(0, 13, 2, 11);
				line(0, 13, -2, 11);
			}
		}

		pop();
	}

	rotate(da: number)
	{
		this.rotateTo(this.a + da);
	}

	rotateTo(a: number)
	{
		this.a = a;
		this.dir.x = cos(a);
		this.dir.y = sin(a);
	}

	move(dt: number)
	{
		const rod = this.rod;
		if (rod)
		{
			const dir = Vec2.fromAngle(rod.a);
			const playerOffset = dir.times(SHIP_DISTANCE);

			if (this.thrust)
			{
				rod.v.addScale(this.dir, dt * THRUST / SHIP_WEIGHT);

				const X = playerOffset;
				const F = this.dir.times(THRUST);
				const torque = X.cross(F);

				rod.va += dt * torque / INERTIA;
			}

			rod.v.scale(FRICTION);
			rod.v.y += dt * G;
			rod.p.addScale(rod.v, dt);

			rod.a += rod.va;

			rod.dir = Vec2.fromAngle(rod.a);
			this.p = rod.p.plus(rod.dir.times(SHIP_DISTANCE));
			ball.p = rod.p.plus(rod.dir.times(-BALL_DISTANCE));

			ship.v = rod.v;
		}
		else
		{
			if (this.thrust)
				this.v.addScale(this.dir, dt * THRUST / SHIP_WEIGHT);

			this.v.y += dt * G;
			this.p.addScale(this.v, dt);
		}
		return true;
	}

	damage()
	{
		if (ship.shield)
			return true;
		die();
		return false;
	}

	kill()
	{
		super.kill();

		if (this.rod)
		{
			this.rod.kill();
			ball.kill();
			this.rod = null;
		}
	}
}
