///// <reference path="entity.ts"/>
///// <reference path="ball.ts"/>

import { Vec2 } from './vec2';
import { Entity } from './entity';
import { Rod } from './rod';
import { Bullet, BULLET_SPEED } from './bullet';
import { Game } from './game';

const SHIP_RADIUS = 14.5;
const SHIELD_RADIUS = 16;
const SHIP_WEIGHT = 0.75;
const THRUST = 200;
const SHIELD_FUEL_RATE = 1/5;

const BALL_WEIGHT = 0.75;

const CABLE_LENGTH = 70;
const TOTAL_WEIGHT = SHIP_WEIGHT + BALL_WEIGHT;
const BALL_FRACTION = SHIP_WEIGHT / TOTAL_WEIGHT;
const SHIP_FRACTION = BALL_WEIGHT / TOTAL_WEIGHT;
const BALL_DISTANCE = CABLE_LENGTH * BALL_FRACTION;
const SHIP_DISTANCE = CABLE_LENGTH * SHIP_FRACTION;

const INERTIA = SHIP_WEIGHT * SHIP_DISTANCE * SHIP_DISTANCE +
	BALL_WEIGHT * BALL_DISTANCE * BALL_DISTANCE;

const FRICTION = 1;//0.99;

const G = 45;
const CABLE_FORCE = G / 40;

export class Ship extends Entity
{
	rod: Rod | null = null;

	dir = new Vec2(0, 0);
	v = new Vec2(0, 0);
	a = -90;
	thrust = false;
	shield = false;
	refuel = false;
	fuel = 10;

	timeFire = 0;

	constructor()
	{
		super(new Vec2(0, 0), SHIP_RADIUS);

		this.rotateTo(-90);
	}

	reset()
	{
		this.p = Game.level.checkpointPos.clone();
		this.v = new Vec2(0, 0);
		this.rotateTo(-90);
		this.thrust = false;
		this.shield = false;

		this.rod = null;
	}

	draw()
	{
		fill(0, 0, 0);
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
		else
		{

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
			rod.p.x = (rod.p.x + Game.levelImg.width) % Game.levelImg.width;
			
			rod.a += rod.va;

			rod.dir = Vec2.fromAngle(rod.a);
			this.p = rod.p.plus(rod.dir.times(SHIP_DISTANCE));
			Game.ball.p = rod.p.plus(rod.dir.times(-BALL_DISTANCE));

			this.v = rod.v;
		}
		else
		{
			if (this.thrust)
				this.v.addScale(this.dir, dt * THRUST / SHIP_WEIGHT);

			this.v.y += dt * G;
			this.p.addScale(this.v, dt);
			this.p.x = (this.p.x + Game.levelImg.width) % Game.levelImg.width;
		}
		return true;
	}

	damage(_friendly: boolean)
	{
		if (_friendly || this.shield)
			return true;
		this.die();
		return false;
	}

	kill()
	{
		if (this.rod)
		{
			this.rod.kill();
			this.rod.explode();	// required because rod isn't in Game.entities.
			this.rod = null;

			Game.ball.kill();
		}

		super.kill();
	}

	dead: Boolean = false;
	die() {
		this.dead = true;
	}

	activateShield(dt: number, wasAttaching: boolean)
	{
		let shield = false;
		let attaching = false;

		if (!this.rod)
		{
			if (Game.ball.collide(this.p, CABLE_LENGTH))
			{
				attaching = true;
				shield = true;

				const rodDir = Game.ball.p.minus(this.p);
				this.v.addScale(rodDir, dt * CABLE_FORCE);
			}
			else if (wasAttaching)
			{
				var rodDir = this.p.minus(Game.ball.p).unit();
				var rod = this.rod = new Rod(
					this.p.minus(rodDir.times(SHIP_DISTANCE)),
					rodDir.angle()
				);
				rod.dir = rodDir;
				rod.v = this.v.times(1 / 2);
				rod.va = -this.v.cross(rodDir) * dt;

				Game.ball.invincible = false;
			}
		}

		if (!shield) {
			this.shield = true;
			this.fuel -= dt * SHIELD_FUEL_RATE;
		}
		
		return attaching;
	}

	fire(fire: boolean)
	{
		if (fire)
		{
			if (Game.time - this.timeFire > 0.5)
			{
				this.timeFire = Game.time;
				const p = this.p.plus(this.dir.times(this.r));
				const b = new Bullet(p, this.dir.times(BULLET_SPEED).plus(this.v));
				b.friendly = true;
				Game.particles.push(b);
			}
		}
		else
		{
			this.timeFire = 0.25;
		}
	}
}
