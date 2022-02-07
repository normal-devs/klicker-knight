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
  D ->> D: error: unknown | null
  D ->> D: hasGameFile() <br> isOnDisk: boolean <br>
  D ->> A: isOnDisk: boolean <br> error: unknown | null

  alt encountered error
    D ->> D: hasGameFile() <br> isFileOnDisk: boolean
    D ->> A: isFileOnDisk: boolean <br> error: unknown
  else
    D ->> A: isFileOnDisk: true <br> error: null
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

  alt encountered error
    D ->> A: data: null <br> error: unknown
  else
    D ->> A: data: unknown <br> error: null
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
    D ->> A: isSaved: false <br> error: unknown
  else
    D ->> A: isSaved: true <br> error: unknown
  end
```
