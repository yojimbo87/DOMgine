function Playground(options) {
    this._options = {
        elementID: options.id || 'playground',
        map: {
            width: options.map.width || 512,
            height: options.map.height || 512
        },
        tile: {
            width: options.tile.width || 16,
            height: options.tile.height || 16
        }
    };
    
    this._element = $('#' + this._options.id);
    
    this._mapScale = {
        width: 0,
        height: 0
    };
    this._finder = new PF.AStarFinder({ allowDiagonal: true });
    
    this._map = [];
    this._entities = {};
    
    this._initMap();
};

Playground.prototype._initMap = function () {
    var i, ilen,
        j, jlen;

    this._mapScale.width = this._options.map.width / this._options.tile.width;
    this._mapScale.height = this._options.map.height / this._options.tile.height;
    
    for (i = 0, ilen = this._mapScale.width; i < ilen; i++) {
        this._map[i] = [];
    
        for (j = 0, jlen = this._mapScale.height; j < jlen; j++) {
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

Playground.prototype.updateEntityPosition = function (elementID, x, y) {
    var entity = this._entities[elementID];
        
    if (entity) {
        this._map[entity.y][entity.x] = 0;
        entity.x = x;
        entity.y = y;
        this._map[y][x] = 1;
    }
};

Playground.prototype.findPath = function (start, end) {
    var grid = new PF.Grid(
            this._mapScale.width,
            this._mapScale.height, 
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