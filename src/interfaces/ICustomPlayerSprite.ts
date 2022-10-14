import { Physics } from 'phaser';
import { IPlayerObject } from './IPlayerObject';

export interface ICustomPlayerSprite extends Physics.Arcade.Sprite { 
    playerObjectState?: IPlayerObject;
};
