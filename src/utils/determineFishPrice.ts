import { Rarity } from "../constants";
import { IFish } from "../interfaces";

export const determineFishPrice = (fish: IFish): number => {
    switch (fish.rarity) {
        case Rarity.Common:
            return 0.5 * fish.weight;
        case Rarity.Uncommon:
            return 1 * fish.weight;
        case Rarity.Rare:
            return 2 * fish.weight;
        case Rarity.Legendary:
            return 5 * fish.weight;
    }
}