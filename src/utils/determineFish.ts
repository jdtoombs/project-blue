import { Rarity } from '../constants';
import { IFish } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

export const determineFish = (currentFish: IFish) => {
  // TODO: Determine fish rarity and difficulty to catch
  const rng = Phaser.Math.Between(0, 100);
  if (rng <= 50) {
    return (currentFish = {
      id: uuidv4(),
      name: 'Common Fish',
      rarity: Rarity.Common,
      weight: Phaser.Math.Between(1, 3),
    });
  } else if (rng > 50 && rng <= 75) {
    return (currentFish = {
      id: uuidv4(),
      name: 'Uncommon Fish',
      rarity: Rarity.Uncommon,
      weight: Phaser.Math.Between(3, 5),
    });
  } else if (rng > 75 && rng <= 90) {
    return (currentFish = {
      id: uuidv4(),
      name: 'Rare Fish',
      rarity: Rarity.Rare,
      weight: Phaser.Math.Between(5, 7),
    });
  } else {
    return (currentFish = {
      id: uuidv4(),
      name: 'Legendary Fish',
      rarity: Rarity.Legendary,
      weight: Phaser.Math.Between(7, 10),
    });
  }
};
