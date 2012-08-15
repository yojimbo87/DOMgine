Walker is a library which allows you to create lemmings style animated character(s) that are able to navigate within specific area.

Usage
===

Below is an example usage of walker. You can also see it in action [here](http://yojimbo87.github.com/walker/).

First include some js files:

    <script src="http://code.jquery.com/jquery-1.8.0.min.js" type="text/javascript"></script>
    <script src="walker/pathfinding-browser.js" type="text/javascript"></script>
    <script src="walker/playground.js" type="text/javascript"></script>
    <script src="walker/walker.js" type="text/javascript"></script>

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

And let it do its magic:
    
    $(document).ready(function() {
        // create playground for walker entities
        var playground = new Playground({
            elementID: 'playground'
        });
        
        // create main walker which will move around
        var actor1 = new Walker({
            elementID: 'actor1',
            cssClasses: 'human',
            sprite: '../sprites/lemming-joe.png',
            start: {
                x: 2,
                y: 2
            },
            playground: playground
        });
        
        // register mouse click event within playground and move main walker
        $('#playground').click(function(e) {
            actor1.move(
                e.pageX - this.offsetLeft, 
                e.pageY - this.offsetTop
            );
        });
        
        // create static walker
        var actor2 = new Walker({
            elementID: 'actor2',
            cssClasses: 'human',
            sprite: '../sprites/lemming-johny.png',
            start: {
                x: 4,
                y: 4
            },
            playground: playground
        });
    });

Dependencies
===

- [jQuery](http://jquery.com/)
- [Pathfinding.js](https://github.com/qiao/PathFinding.js)
    
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

Computes path with A* algorithm to avoid obstacles on playground map. Returns `array` which consists of set of arrays where each holds two elements representing x and y coordinates within map.