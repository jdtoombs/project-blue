import { GameObjects } from "phaser";

export interface IStoreItem {
    name: string;
    price: number;
    button: GameObjects.Sprite;
    description: string;
}