import { Rarity } from '../constants';
import { FishItems, IFish } from '../interfaces';

export const determineFishItem = (Fish: IFish) => {
  switch (Fish.rarity) {
    case Rarity.Common:
      return FishItems.CommonFish;
    case Rarity.Uncommon:
      return FishItems.UncommonFish;
    case Rarity.Rare:
      return FishItems.RareFish;
    case Rarity.Legendary:
      return FishItems.LegendaryFish;
  }
};
