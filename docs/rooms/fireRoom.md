# Fire Room

A room with three different paths.
One path leads to a person, the second path leads to a item and the third path leads nowhere.
Each path is on fire but the player is given two buckets of water.
The goal of this room is to save the person.

## PlayerStates

- **AtEntrance**: You are in the main room with x buckets of water.
- **DouseForward**: The water from the bucket puts out the fire in front of you.
- **DouseLeft**: The water from the bucket puts out the fire to the left of you.
- **DouseRight**: The water from the bucket puts out the fire to the right of you.
- **Nothing**: There is no water left. You did nothing.
- **SavedPerson**: Congratulations!!! You saved the person!!!
- **ItemRetrieved**: Congratulations!!! You got a cool item!!!
- **EmptyPath**: There is nothing here. Better luck next time.
- **Flameless**: You already put out the fire here...

## RoomState

- **waterBuckets**: The number of buckets that still have water in them.
- **fireForward**: Boolean for if there is a fire in front of you.
- **fireLeft**: Boolean for if there is a fire to the left of you.
- **fireRight**: Boolean for if there is a fire to the right of you.

## Commands

- **leave**: You leave through the only available door.
- **throwBucketForward**: You throw the bucket of water.
- **throwBucketLeft**: You throw the bucket of water.
- **throwBucketRight**: You throw the bucket of water.

## Diagram

```mermaid
stateDiagram-v2
  [*] --> AtEntrance

  AtEntrance --> DouseForward: throwBucketForward (if there is water left)
  AtEntrance --> DouseLeft: throwBucketLeft (if there is water left)
  AtEntrance --> DouseRight: throwBucketRight (if there is water left)
  AtEntrance --> Nothing: throwBucket* (if there is no water left)
  AtEntrance --> [*]: leave

  DouseForward --> EmptyPath
  DouseForward --> Flameless
  DouseForward --> ItemRetrieved
  DouseForward --> SavedPerson

  DouseLeft --> EmptyPath
  DouseLeft --> Flameless
  DouseLeft --> ItemRetrieved
  DouseLeft --> SavedPerson

  DouseRight --> EmptyPath
  DouseRight --> Flameless
  DouseRight --> ItemRetrieved
  DouseRight --> SavedPerson

  EmptyPath --> AtEntrance
  Flameless --> EmptyPath
  ItemRetrieved --> AtEntrance
  Nothing --> AtEntrance
  SavedPerson --> AtEntrance
```
