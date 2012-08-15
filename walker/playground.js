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

Playground.prototype.mouseClick = function (callback) {
    this._element.on('click', function (event) {
        callback(
            event.pageX - this.offsetLeft,
            event.pageY - this.offsetTop
        );
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