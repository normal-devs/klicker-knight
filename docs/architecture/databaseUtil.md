# DatabaseUtil

The [DatabaseUtil](../src/utils/databaseUtil.ts) abstracts
writing and reading to the file system,
as well as parsing and serializing the game data.

For now it is assumed that there is only one save file.

## Delete

```mermaid
sequenceDiagram
  autonumber
  participant A as Actor
  participant D as DatabaseUtil
  participant F as File System

  A ->> D: delete()
  D ->> F: unlink()

  note over D: Handle errors

  D ->> D: hasGameFile() <br> isOnDisk: boolean
  D ->> A: isOnDisk: boolean
```

## HasGameFile

```mermaid
sequenceDiagram
  autonumber
  participant A as Actor
  participant D as DatabaseUtil
  participant F as File System

  A ->> D: hasGameFile()
  D ->> F: exists()
  F ->> D: isOnDisk: boolean
  D ->> A: isOnDisk: boolean
```

## Load

```mermaid
sequenceDiagram
  autonumber
  participant A as Actor
  participant D as DatabaseUtil
  participant F as File System

  A ->> D: load()
  D ->> F: read()
  F ->> D: serializeData: string

  D ->> D: parse(serializeData) <br> data: unknown

  alt encountered error
    D ->> A: data: null
  else
    D ->> A: data: unknown
  end
```

## Save

```mermaid
sequenceDiagram
  autonumber
  participant A as Actor
  participant D as DatabaseUtil
  participant F as File System

  A ->> D: save(data: unknown)
  D ->> D: serialize(data) <br> serializedData: string
  D ->> F: write(serializedData)

  alt encountered error
    D ->> A: isSaved: false
  else
    D ->> A: isSaved: true
  end
```
