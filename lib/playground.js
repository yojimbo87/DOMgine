function Playground(options) {
    options.map = options.map || {};
    options.tile = options.tile || {};

    this._options = {
        elementID: options.id || 'playground',
        mapWidth: options.mapWidth || 512,
        mapHeight: options.mapHeight || 512,
        tileWidth: options.tileWidth || 16,
        tileHeight: options.tileHeight || 16
    };
    
    this._element = $('#' + this._options.elementID);
    this._mapScaleWidth = 0;
    this._mapScaleWidtHeight = 0;
    this._finder = new PF.AStarFinder({ allowDiagonal: true });
    this._map = [];
    this._entities = {};
    
    this._initMap();
};

Playground.prototype._initMap = function () {
    var i, ilen,
        j, jlen;

    this._mapScaleWidth = this._options.mapWidth / this._options.tileWidth;
    this._mapScaleHeight = this._options.mapHeight / this._options.tileHeight;
    
    for (i = 0, ilen = this._mapScaleWidth; i < ilen; i++) {
        this._map[i] = [];
    
        for (j = 0, jlen = this._mapScaleHeight; j < jlen; j++) {
            this._map[i][j] = 0;
        }
    }
};

Playground.prototype.addEntity = function (entityID, x, y) {
    var entity = this._entities[entityID];
    
    if (entity === undefined) {
        this._entities[entityID] = {
            id: entityID,
            x: x,
            y: y
        };
        
        this._map[y][x] = 1;
    }
};

Playground.prototype.removeEntity = function (entityID) {
    var entity = this._entities[entityID];
    
    if (entity) {
        this._map[entity.y][entity.x] = 0;
        
        delete this._entities[entityID];
    }
};

Playground.prototype.updateEntityPosition = function (entityID, x, y) {
    var entity = this._entities[entityID];
        
    if (entity) {
        this._map[entity.y][entity.x] = 0;
        entity.x = x;
        entity.y = y;
        this._map[y][x] = 1;
    }
};

// returns integer which indicates if z-index css property should be 
// incemented or decremented to properly show overlay
// +1 - set z-index to high value
// 0 - no change
// -1 - set z-index to low value
Playground.prototype.zIndexStatus = function (x, y) {
    var zIndexChange = 0;
    
    if (((y - 1) >= 0) && (this._map[y - 1][x] === 1)) {
        zIndexChange = 1;
    } else if (((y + 1) < this._mapScaleHeight) && (this._map[y + 1][x] === 1)) {
        zIndexChange = -1;
    }
    
    return zIndexChange;
};

Playground.prototype.checkPosition = function (x, y) {
    if ((x >= 0) && 
        (x < this._mapScaleWidth) &&
        (y >= 0) &&
        (y < this._mapScaleHeight) &&
        (this._map[y][x] === 0)) {
        return true;
    } else {
        return false;
    }
};

Playground.prototype.findPath = function (start, end) {
    var grid = new PF.Grid(
            this._mapScaleWidth,
            this._mapScaleHeight, 
            this._map
        );
    
    return this._finder.findPath(
        start.x, 
        start.y, 
        end.x, 
        end.y, 
        grid
    );
};

Playground.prototype.onMouseNavigation = function (callback) {
    this._element.on('click', function (event) {
        callback(
            event.pageX - this.offsetLeft,
            event.pageY - this.offsetTop
        );
    });
};

Playground.prototype.onMouseMove = function (callback) {
    this._element.on('mousemove', function (event) {
        callback(
            event.pageX - this.offsetLeft,
            event.pageY - this.offsetTop
        );
    });
};

Playground.prototype.onKeyboardNavigation = function (callback) {
    var keys = {},
        keysCount = 0,
        interval = null,
        trackedKeys = {
            119: true, // W
            87: true, // w
            115: true, // S
            83: true, // s
            97: true, // A
            65: true, // a
            100: true, // D
            68: true, // d
            37: true, // left arrow
            38: true, // up arrow
            39: true, // right arrow
            40: true // down arrow
        };

    $(document).keydown(function (event) {
        var code = event.which;
        
        if (trackedKeys[code]) {
            if (!keys[code]) {
                keys[code] = true;
                keysCount++;
            }
            
            if (interval === null) {
                interval = setInterval(function () {
                    var direction = '';
                    
                    // check if north or south
                    if (keys[119] || keys[87] || keys[38]) {
                        direction = 'n';
                    } else if (keys[115] || keys[83] || keys[40]) {
                        direction = 's';
                    }
                    
                    // concat west or east
                    if (keys[97] || keys[65] || keys[37]) {
                        direction += 'w';
                    } else if (keys[100] || keys[68] || keys[39]) {
                        direction += 'e';
                    }
                
                    callback(direction);
                }, 1000 / 50);
            }
        }
    });
    
    $(document).keyup(function (event) {
        var code = event.which;
    
        if (keys[code]) {
            delete keys[code];
            keysCount--;
        }
        
        // need to check if keyboard movement stopped
        if ((trackedKeys[code]) && (keysCount === 0)) {
            clearInterval(interval);
            interval = null;
            callback(0);
        }
    });
};

Playground.prototype.printMap = function () {
    var $map = $('#map'),
        i, ilen, j, jlen;
    
    $map.html('');
    
    for (i = 0, ilen = this._map.length; i < ilen; i++) {
        for (j = 0, jlen = this._map[i].length; j < jlen; j++) {
            $map.append(this._map[i][j] + ' ');
        }
        
        $map.append('<br />');
    }
};