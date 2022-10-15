import { Rarity } from "../constants";

export const determineFishDifficulty = (rarity: Rarity, baseCount: number) => {
    switch (rarity) {
        case Rarity.Common: {
            return baseCount;
        } case Rarity.Uncommon: {
            return baseCount * 1.10;
        }
        case Rarity.Rare: {
            return baseCount * 1.5;
        }
        case Rarity.Legendary: {
            return baseCount * 2;
        } default: {
            return baseCount;
        }
    }
}