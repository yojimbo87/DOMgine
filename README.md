DOMgine is a DOM based game engine.

Usage
===

Below is a simple usage example of DOMgine. You can also see it in action [here](http://yojimbo87.github.com/DOMgine/).

First include some js files:

    <!--[if lt IE 9]>
    <script src="../lib/shims.js" type="text/javascript"></script>
    <![endif]-->
    <script src="http://code.jquery.com/jquery-1.8.0.min.js" type="text/javascript"></script>
    <script src="lib/pathfinding-browser.js" type="text/javascript"></script>
    <script src="lib/playground.js" type="text/javascript"></script>
    <script src="lib/actor.js" type="text/javascript"></script>

Then add a bit of HTML to body:

    <div id="playground"></div>
    
Style at your will:

    #playground { 
        background: #000;
        cursor: url('sprites/arrow.cur'), default;
        height: 512px; 
        width: 512px; 
    }

    .human { cursor: url('sprites/hand.cur'), pointer; }

And let it play:
    
    $(document).ready(function() {
        // create playground for actor entities
        var playground = new DG.Playground({
            elementID: 'playground'
        });
        
        // create first actor entity
        var actor1 = new DG.Actor({
            elementID: 'actor1',
            cssClasses: 'human',
            sprite: 'assets/sprites/actor-joe.png',
            start: {
                x: 2,
                y: 2
            },
            playground: playground
        });
        
        // create second actor entity
        var actor2 = new DG.Actor({
            elementID: 'actor2',
            cssClasses: 'human',
            sprite: 'assets/sprites/actor-johny.png',
            start: {
                x: 4,
                y: 4
            },
            playground: playground
        });
        
        // navigate first actor to destination coordinates
        playground.onMouseNavigation(function (left, top) {
            actor1.move(left, top);
        });
        
        // navigate second actor towards direction
        playground.onKeyboardNavigation(function (direction) {
            actor2.step(direction);
        });
        
        // rotate both actors towards mouse direction
        playground.onMouseMove(function (left, top) {
            actor1.rotate(left, top);
            actor2.rotate(left, top);
        });
    });

Dependencies
===

- [jQuery](http://jquery.com/) for DOM manipulation
- [Pathfinding.js](https://github.com/qiao/PathFinding.js) for pathfinding algorithms
    
Public API
===

Playground class
---

    var playground = DG.Playground(options);
    
- `options` - object which holds following settings:
  - `elementID` - DOM element ID string (empty string by default)
  - `mapWidth` - number of pixels representing width of playground map
  - `mapHeight` - number of pixels representing height of playground map
  - `tileWidth` - number of pixels representing width of single tile used for determining location on map (16 by default)
  - `tileHeight` - number of pixels representing height of single tile used for determining location on map (16 by default)
  
Constructor for playground object which is responsible for map functionality and pathfinding.

*****

    playground.addEntity(entityID, x, y);
    
- `entityID` - string ID of entity
- `x` - current x map coordinate of entity
- `y` - current y map coordinate of entity

Adds entity to playground map to track its' position. Returns `void`.

*****

    playground.removeEntity(entityID);
    
- `entityID` - string ID of entity

Removes entity from playground map. Returns `void`.

*****

    playground.updateEntityPosition(entityID, x, y);
    
- `entityID` - string ID of entity
- `x` - current x map coordinate of entity
- `y` - current y map coordinate of entity

Updates current position of specified entity within playground map. Returns `void`.

*****

    playground.zIndexStatus(x, y);
    
- `x` - current x map coordinate of entity
- `y` - current y map coordinate of entity

Checks if there aren't neighbor entities one tile position up and down within specified map coordinates to determine z-index overlay changes for entity. Returns `number` which indicates if z-index should be set to high value (+1), stay unchanged (0) or set to low value (-1).

*****

    playground.checkPosition(x, y);
    
- `x` - x map coordinate
- `y` - y map coordinate

Checks if specified position on map isn't occupied. Returns `boolean` indicating if position is or isn't occupied.

*****

    playground.findPath(start, end);
    
- `start` - object with `x` and `y` coordinates which represents starting position
- `end` - object with `x` and `y` coordinates which represents ending position

Computes path with A* algorithm to avoid obstacles on playground map. Returns `array` which consists of set of arrays where each holds two elements representing x and y coordinates within map.

*****

    playground.onMouseNavigation(callback);
    
- `callback(left, top)` - callback invoked when left mouse button within playground element is clicked
  - `left` - number of pixels from left corner of playground element (x coordinate)
  - `top` - number of pixels from top corner of playground element (y coordinate)
  
Invokes callback when left mouse button click event is fired within playground element. Callback arguments are recalculated to position within playground. Returns `void`.

*****

    playground.onMouseMove(callback);
    
- `callback(left, top)` - callback invoked when mouse move event is fired within playground element
  - `left` - number of pixels from left corner of playground element (x coordinate)
  - `top` - number of pixels from top corner of playground element (y coordinate)

Invokes callback when mouse move event is fired within playground element. Returns `void`.
  
*****

    playground.onKeyboardNavigation(callback);
    
- `callback(direction)` - callback invoked when w, s, a, d characters on keyboard are pressed
  - `direction` - string which represents direction based on characters pressed (can be north `n`, south, `s`, west `w`, east `e`, northwest `nw`, northeast `ne`, southwest `sw`, southeast `se` or numeric `0` value when movement stopped)

Invokes callback when w, s, a, d characters on keyboards are pressed. Returns `void`.

Actor class
---

    var actor = DG.Actor(options);

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

Constructor for standalone actor entity which performs create animation upon creation. If playground reference is passed within options object, entity adds and removes itself, updates each movement cycle on map and uses pathfinding and z-index status information given by playground object.

*****

    actor.move(left, top);

- `left` - number of pixels from left corner (x coordinate)
- `top` - number of pixels from top corner (y coordinate)

Initiates movement between current and destination point. When playground option is set, movement is calculated within map. Returns `void`.

*****

    actor.step(direction);
    
- `direction` - string based cardinal direction

Moves entity to specified cardinal direction (can be north `n`, south, `s`, west `w`, east `e`, northwest `nw`, northeast `ne`, southwest `sw`, southeast `se` or numeric `0` value when movement should be stopped). Returns `void`.

*****

    actor.rotate(left, top);
    
- `left` - number of pixels from left corner (x coordinate)
- `top` - number of pixels from top corner (y coordinate)

Rotates actor entity towards cardinal direction computed from specified coordinates. Returns `void`.

*****

    actor.destroy(callback);

- `callback` - callback invoked when animation is completed

Performs destroy animation of single actor entity and removes element from DOM if playground options is set. Returns `void`.
