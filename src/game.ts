import { Level } from "./level";
import { Ship } from "./ship";
import { Ball } from "./ball";
import { Particle } from "./particle";
import { Entity } from "./entity";
import { Vec2 } from "./vec2";
import { Explosion } from "./explosion";

export const TILE_SIZE = 40;

export class Game {
  
  static ship: Ship = null!;
  static ball: Ball = null!;
  static level: Level = null!;

  static levelImg: p5.Image = null!;

  static particles: Particle[] = [];
  static entities: Entity[] = [];

  static score: number = 0;
  static lives: number = 3;
  static time: number;

  static game:Game = null!;
}
