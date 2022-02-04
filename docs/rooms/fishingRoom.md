# Fishing Room

A room with a beach and a boat dock. The player can fish from dock or leave. Fishing may result in catching a fish.

## PlayerStates

- **AtEntrance**: The player is on a dock with a working/broken fishing pole. Total number of fish caught is X so far!
- **Fishing**: Hopefully the fish are hungry today.
- **Caught**: Congratulations!!! The player caught a fish!!!
- **BrokenLine**: The player has a broken their fishing line and the fish got away.

## Commands

- **leave**: The player leaves through the only available door. Total number of fish caught is X.
- **fish**: The player casts their fishing line.
- **fix**: The player fixs their fishing pole so they can fish again.
- **stop**: The player stops fishing.

## Diagram

```mermaid
stateDiagram-v2
  [*] --> AtEntrance

  AtEntrance --> Fishing: fish (if rod is working)
  AtEntrance --> BrokenLine: fish (if rod is broken)
  AtEntrance --> [*]: leave

  Fishing --> AtEntrance: stop
  Fishing --> Caught: fish (if catch)
  Fishing --> BrokenLine: fish (if break)
  Fishing --> Fishing: fish (else)

  Caught --> AtEntrance: default

  BrokenLine --> AtEntrance: stop
  BrokenLine --> AtEntrance: fix
```
