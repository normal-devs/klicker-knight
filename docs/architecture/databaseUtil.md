# DatabaseUtil

The [DatabaseUtil](../../src/utils/databaseUtil.ts) abstracts
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

  alt success
    D ->> A: isFileOnDisk: true <br> error: null
  else encountered error
    D ->> D: hasGameFile() <br> isFileOnDisk: boolean
    D ->> A: isFileOnDisk: boolean <br> error: unknown
  end
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
  F ->> D: isFileOnDisk: boolean
  D ->> A: isFileOnDisk: boolean
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

  alt success
    D ->> A: data: unknown <br> error: null
  else encountered error
    D ->> A: data: null <br> error: unknown
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

  alt success
    D ->> A: isSaved: true <br> error: null
  else encountered error
    D ->> A: isSaved: false <br> error: unknown
  end
```
