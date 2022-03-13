# Fishing Room

- **roomType**: fishingRoom

A room with a beach and a boat dock. You can fish from dock or leave. Fishing may result in catching a fish.

## PlayerStates

- **AtEntrance**: You are on a dock with a working/broken fishing pole. Total number of fish caught is X so far!
- **Fishing**: Hopefully the fish are hungry today.
- **Caught**: Congratulations!!! You caught a fish!!!
- **BrokenLine**: You have a broken fishing line and the fish got away.

## Commands

- **leave**: You leaves through the only available door. Total number of fish caught is X.
- **fish**: You casts your fishing line.
- **fix**: You fix your fishing pole so you can fish again.
- **stop**: You stops fishing.

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
