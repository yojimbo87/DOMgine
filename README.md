Walker is a library which allows you to create lemmings style animated character(s) that are able to navigate within specific area.

Public API
===

Walker class
---

`Walker(options)`

Constructor for standalone walker entity which performs create animation upon creation.

**options** - object which holds following settings:

- elementID - DOM element ID string of entity (empty string by default)
- cssClasses - space delimited string of CSS classes assigned to entity (empty string by default)
- sprite - string path to sprite image (empty string by default)
- columnsCount - number of columns within sprite where one column represents single movement state (8 by default)
- rowsCount - number of rows within sprite, where one row represents set of movement for single direction (8 by default)
- width - number of pixels representing width of single picture within sprite (32 by default)
- height - number of pixels representing height of single picture within sprite (32 by default)
- tileWidth - number of pixels representing width of single tile used for determining location (16 by default)
- tileHeight - number of pixels representing height of single tile used for determining location (16 by default)
- playground - reference to playground object which is responsible for map and pathfinding

`walker.move(left, top)`

Initiates movement between current and destination point. When playground option is set, movement is calculated within map.

**left** - number of pixels from left corner (x coordinate)
**top** - number of pixels from top corner (y coordinate)

`walker.destroy(callback)`

Performs destroy animation of single walker entity and removes element from DOM if playground options is set.

**callback** - callback invoked when animation is completed

Playground class
---

