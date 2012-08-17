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
        cursor: url('assets/cursors/arrow.cur'), default;
        height: 512px; 
        width: 512px; 
    }

    .human { cursor: url('assets/cursors/hand.cur'), pointer; }

And let it play:
    
    $(document).ready(function() {
        // create playground for actor entities
        var playground = new DG.Playground({
            elementID: 'playground'
        });
        
        // create first actor entity
        var actor1 = new DG.Actor({
            id: 'actor1',
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
            id: 'actor2',
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
    
**Parameters**

`options` - object which holds following settings:  
- `elementID` - DOM element ID string (playground by default)
- `tileWidth` - number of pixels representing width of single tile used for determining location on map (16 by default)
- `tileHeight` - number of pixels representing height of single tile used for determining location on map (16 by default)
  
Constructor for playground object which is responsible for map functionality and pathfinding. Map dimensions are calculated as (playground element width / tileWidth) and (playground element height / tileheight), therefore playground element width and height should be dividable by tileWidth and tileHeight.

*****

    playground.addEntity(entityID, x, y);

**Parameters**

`entityID` - string ID of entity  
`x` - current x map coordinate of entity  
`y` - current y map coordinate of entity

**Returns**

`void`

Adds entity to playground map to track its' position.

*****

    playground.removeEntity(entityID);

**Parameters**

`entityID` - string ID of entity

**Returns**

`void`

Removes entity from playground map and DOM.

*****

    playground.updateEntityPosition(entityID, x, y);
   
**Parameters**
   
`entityID` - string ID of entity  
`x` - current x map coordinate of entity  
`y` - current y map coordinate of entity

**Returns**

`void`

Updates current position of specified entity within playground map.

*****

    playground.zIndexStatus(x, y);
    
**Parameters**
  
`x` - current x map coordinate of entity  
`y` - current y map coordinate of entity

**Returns**

`number` - indicates if z-index should be set to high value (+1), stay unchanged (0) or set to low value (-1)

Checks if there aren't neighbor entities one tile position up and down within specified map coordinates to determine z-index overlay changes for entity.

*****

    playground.checkPosition(x, y);
   
**Parameters**
     
`x` - x map coordinate  
`y` - y map coordinate

**Returns**

`boolean` - indicates if position is or isn't occupied

Checks if specified position on map isn't occupied.

*****

    playground.findPath(start, end);
    
**Parameters**
   
`start` - object which represents starting position
- `x` - x map coordinate
- `y` - y map coordinate

`end` - object which represents ending position
- `x` - x map coordinate
- `y` - y map coordinate

**Returns**

`array` - consists of set of arrays where each holds two elements representing x and y coordinates within map.

Computes path with A* algorithm to avoid obstacles on playground map.

*****

    playground.onMouseClick(callback);
    
**Parameters**
   
`callback(left, top, state)` - callback invoked when left mouse button within playground element is clicked  
- `left` - number of pixels from left corner of playground element (x coordinate)
- `top` - number of pixels from top corner of playground element (y coordinate)
- `state` - character which indicates if left mouse button was pressed pressed 'd' or released 'u'
  
**Returns**

`void`

Invokes callback when left mouse button click event is fired within playground element. Callback arguments are recalculated to position within playground.

*****

    playground.onMouseMove(callback);
    
**Parameters**
   
`callback(left, top)` - callback invoked when mouse move event is fired within playground element  
- `left` - number of pixels from left corner of playground element (x coordinate)
- `top` - number of pixels from top corner of playground element (y coordinate)

**Returns**

`void`
  
Invokes callback when mouse move event is fired within playground element.
  
*****

    playground.onKeyboardNavigation(callback);

**Parameters**
 
`callback(direction)` - callback invoked when w, s, a, d characters on keyboard are pressed  
- `direction` - string which represents direction based on characters pressed (can be north `n`, south, `s`, west `w`, east `e`, northwest `nw`, northeast `ne`, southwest `sw`, southeast `se` or numeric `0` value when movement stopped)

**Returns**

`void`
  
Invokes callback when w, s, a, d characters on keyboards are pressed.

Actor class
---

    var actor = DG.Actor(options);

**Parameters**
 
`options` - object which holds following settings:  
- `id` - ID string of entity which will be also used as DOM elementID (empty string by default)
- `cssClasses` - space delimited string of CSS classes assigned to entity (empty string by default)
- `sprite` - string path to sprite image (empty string by default)
- `columnsCount` - number of columns within sprite where one column represents single movement state (8 by default)
- `rowsCount` - number of rows within sprite, where one row represents set of movement for single direction (8 by default)
- `width` - number of pixels representing width of single picture within sprite (32 by default)
- `height` - number of pixels representing height of single picture within sprite (32 by default)
- `tileWidth` - number of pixels representing width of single tile used for determining location (16 by default)
- `tileHeight` - number of pixels representing height of single tile used for determining location (16 by default)
- `playground` - reference to playground object (false by default)

Constructor for standalone actor entity which performs create animation upon creation. Playground reference is responsible for map related functionality.

*****

    actor.move(left, top);

**Parameters**
 
`left` - number of pixels from left corner (x coordinate)  
`top` - number of pixels from top corner (y coordinate)

**Returns**

`void`

Initiates movement between current and destination point. When playground option is set, movement is calculated within map.

*****

    actor.step(direction);
   
**Parameters**
    
`direction` - string based cardinal direction

**Returns**

`void`

Moves entity to specified cardinal direction (can be north `n`, south, `s`, west `w`, east `e`, northwest `nw`, northeast `ne`, southwest `sw`, southeast `se` or numeric `0` value when movement should be stopped).

*****

    actor.rotate(left, top);
   
**Parameters**
       
`left` - number of pixels from left corner (x coordinate)  
`top` - number of pixels from top corner (y coordinate)

**Returns**

`void`

Rotates actor entity towards cardinal direction computed from specified coordinates.

*****

    actor.destroy(callback);

**Parameters**

`callback()` - callback invoked when animation is completed

**Returns**

`void`

Performs destroy animation of single actor entity and removes element from DOM if playground options is set.
