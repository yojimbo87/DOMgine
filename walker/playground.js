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
    
    this._map = [];
    this._entities = {};
};

Playground.prototype.init = function () {
    var mapWidth = this._options.map.width / this._options.tile.width,
        mapHeight = this._options.map.height / this._options.tile.height,
        i, j;
    
    for (i = 0; i < mapWidth; i++) {
        this._map[i] = [];
    
        for (j = 0; j < mapHeight; j++) {
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
        y = Math.round(position.left / this._options.tile.width),
        x = Math.round(position.top / this._options.tile.height);
        
        this._map[entity.x][entity.y] = 0;
        entity.x = x;
        entity.y = y;
        this._map[x][y] = 1;
    }
};

Playground.prototype.printMap = function () {
    var $map = $('#map'),
        i, j;
    
    $map.html('');
    
    for (i = 0; i < this._map.length; i++) {
        for (j = 0; j < this._map[i].length; j++) {
            $map.append(this._map[i][j] + ' ');
        }
        
        $map.append('<br />');
    }
};