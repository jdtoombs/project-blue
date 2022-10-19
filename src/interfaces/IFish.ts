import { Rarity } from "../constants";

export interface IFish {
    id: string;
    name: string;
    weight: number;
    rarity: Rarity;
}