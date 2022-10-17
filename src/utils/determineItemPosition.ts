/**
 * This function determines the position of an item relative to the inventory image.
 * @param  {Number} itemsLength The length of items the player currently has
 * @param  {Number} itemsPerRow The number of items contained in each row
 * @param  {Number} pixelOffset The number of pixels between each item space
 * @param  {Number} originX The origin x position of the inventory image
 * @return {Number} The x position of the given item
 */

export const determineItemPositionX = (
  itemsLength: number,
  itemsPerRow: number,
  pixelOffset: number,
  originX: number,
) => {
  return originX + pixelOffset * ((itemsLength % itemsPerRow) - 1);
};
