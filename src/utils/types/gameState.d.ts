/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type RoomState = ExampleRoom1;

export interface GameState {
  roomState: RoomState;
}
export interface ExampleRoom1 {
  type: 'exampleRoom1';
  playerState: 'AtEntrance';
}
