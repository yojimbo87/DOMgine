function Playground(options) {
    this._element = $('#' + options.id);

    this._options = {
        map: {
            width: options.map.width || 512,
            height: options.map.height || 512
        },
        tile: {
            width: options.tile.width || 32,
            height: options.tile.height || 32
        }
    };
    
    this._mapScale = {
        width: 0,
        height: 0
    };
    this._finder = new PF.JumpPointFinder();
    
    this._map = [];
    this._entities = {};
};

Playground.prototype.init = function () {
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
    
    this._registerElements();
};

Playground.prototype._registerElements = function () {
    var self = this;
    
    this._element.children().each(function () {
        var $el = $(this),
            position = $el.position(),
            y = position.left / self._options.tile.width,
            x = position.top / self._options.tile.height;
    
        self._entities[this.id] = {
            element: $el,
            x: x,
            y: y
        };
        
        self._map[x][y] = 1;
    });
};

Playground.prototype.updateEntityPosition = function (elementID) {
    var entity = this._entities[elementID],
        position, x, y;
        
    if (entity) {
        position = entity.element.position(),
        x = Math.floor(position.left / this._options.tile.width),
        y = Math.floor(position.top / this._options.tile.height);
        
        this._map[entity.x][entity.y] = 0;
        entity.x = x;
        entity.y = y;
        this._map[x][y] = 1;
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
        i, j;
    
    $map.html('');
    
    for (i = 0; i < this._map.length; i++) {
        for (j = 0; j < this._map[i].length; j++) {
            $map.append(this._map[j][i] + ' ');
        }
        
        $map.append('<br />');
    }
};