import { GameObjects } from "phaser";
import { IFish } from "./IFish";

export interface IGridSquare {
    isOpen: boolean,
    x: number,
    y: number,
    item: GameObjects.Sprite | undefined,
    itemDetails: IFish | undefined,
}