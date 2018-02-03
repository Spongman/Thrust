
declare interface Array<T>
{
    removeAt(i: number): T;
    remove(e: T): void;
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

