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
    
    this._initMap();
    this._registerElements();
};

Playground.prototype._initMap = function () {
    var mapWidth = this._options.map.width / this._options.tile.width,
        mapHeight = this._options.map.height / this._options.tile.height,
        i, j;
    
    for (i = 0; i < mapWidth; i++) {
        this._map[i] = [];
    
        for (j = 0; j < mapHeight; j++) {
            this._map[i][j] = 0;
        }
    }
};

Playground.prototype._registerElements = function () {
    var self = this;
    
    this._element.children().each(function () {
        self._entities[this.id] = {
            element: $(this)
        };
    });
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