Walker is a library which allows you to create lemmings style animated character(s) that are able to navigate within specific area.

Public API
===

Walker class
---

    var walker = Walker(options);

- `options` - object which holds following settings:
  - `elementID` - DOM element ID string of entity (empty string by default)
  - `cssClasses` - space delimited string of CSS classes assigned to entity (empty string by default)
  - `sprite` - string path to sprite image (empty string by default)
  - `columnsCount` - number of columns within sprite where one column represents single movement state (8 by default)
  - `rowsCount` - number of rows within sprite, where one row represents set of movement for single direction (8 by default)
  - `width` - number of pixels representing width of single picture within sprite (32 by default)
  - `height` - number of pixels representing height of single picture within sprite (32 by default)
  - `tileWidth` - number of pixels representing width of single tile used for determining location (16 by default)
  - `tileHeight` - number of pixels representing height of single tile used for determining location (16 by default)
  - `playground` - reference to playground object which is responsible for map and pathfinding (false by default)

Constructor for standalone walker entity which performs create animation upon creation.

    walker.move(left, top);

- `left` - number of pixels from left corner (x coordinate)
- `top` - number of pixels from top corner (y coordinate)

Initiates movement between current and destination point. When playground option is set, movement is calculated within map. Returns `void`.

    walker.destroy(callback);

- `callback` - callback invoked when animation is completed

Performs destroy animation of single walker entity and removes element from DOM if playground options is set. Returns `void`.

Playground class
---

    var playground = Playground(options);
    
- `options` - object which holds following settings:
  - `elementID` - DOM element ID string (empty string by default)
  - `mapWidth` - number of pixels representing width of playground map
  - `mapHeight` - number of pixels representing height of playground map
  - `tileWidth` - number of pixels representing width of single tile used for determining location on map (16 by default)
  - `tileHeight` - number of pixels representing height of single tile used for determining location on map (16 by default)
  
Constructor for playground object which is responsible for map functionality and pathfinding.

    playground.addEntity(entityID, x, y);
    
- `entityID` - string ID of entity
- `x` - current x map coordinate of entity
- `y` - current y map coordinate of entity

Adds entity to playground map to track its' position. Returns `void`.

    playground.removeEntity(entityID);
    
- `entityID` - string ID of entity

Removes entity from playground map. Returns `void`.

    playground.updateEntityPosition(entityID, x, y);
    
- `entityID` - string ID of entity
- `x` - current x map coordinate of entity
- `y` - current y map coordinate of entity

Updates current position of specified entity within playground map. Returns `void`.

    playground.zIndexStatus(x, y);
    
- `x` - current x map coordinate of entity
- `y` - current y map coordinate of entity

Checks if there aren't neighbor entities one tile position up and down within specified map coordinates to determine z-index overlay changes for entity. Returns `number` which indicates if z-index should be set to high value (+1), stay unchanged (0) or set to low value (-1).

    playground.findPath(start, end);
    
- `start` - object with `x` and `y` coordinates which represents starting position
- `end` - object with `x` and `y` coordinates which represents ending position

Computes path with A* algorithm to avoid obstacles on map. Returns `array` which consists set of arrays where each holds two elements representing x and y coordinate within map.