let time: number;
let score: number;

declare function die(): void;


declare interface Array<T>
{
	removeAt(i: number): T;
}



declare interface Math
{
    trunc(value: number): number;
}

declare namespace p5
{
    interface Color
    {
        [key: number]: number;
    }
}
