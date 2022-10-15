import { Physics } from 'phaser';
import { IInventory } from './IInventory';
import { IPlayerObject } from './IPlayerObject';

export interface ICustomPlayerSprite extends Physics.Arcade.Sprite { 
    playerObjectState?: IPlayerObject;
    inventory?: IInventory;
};
