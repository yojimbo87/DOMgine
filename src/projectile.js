DG.Projectile = function (options) {
    this._options = {
        elementID: options.id || ('projectile-' + Math.floor(Math.random()*10000)),
        cssClasses: options.cssClasses || '',
        sprite: options.sprite || '',
        columnsCount: options.columnsCount || 1,
        rowsCount: options.rowsCount || 8,
        height: options.height || 8,
        width: options.width || 8,
        tileWidth: options.tileWidth || 16,
        tileHeight: options.tileHeight || 16,
        startX: options.startX || 0,
        startY: options.startY || 0,
        playground: options.playground || false
    };
    
    this._current = {
        column: 0,
        row: 0,
        direction: 'n',
        x: Math.floor(options.startX) || 0,
        y: Math.floor(options.startY) || 0,
        shootInterval: null
    };
    
    // if playground is present, append DOM element manually 
    // and register entity within playground
    if (this._options.playground !== false) {
        $('#' + this._options.playground._options.elementID).append(
           '<div id="' + this._options.elementID + '"></div>'
        );
        
        this._options.playground.addEntity(
            this._options.elementID,
            this._current.x,
            this._current.y
        );
    }
    
    // get jquery element object and add css classes if specified
    this._element = $('#' + this._options.elementID);
    
    if (this._options.cssClasses !== '') {
        this._element.addClass(this._options.cssClasses);
    }
    
    // set initial css attributes
    this._element.css({
        'backgroundImage': 'url("' + this._options.sprite + '")',
        'height': this._options.height + 'px',
        'left': (this._current.x * this._options.tileWidth) + 'px',
        'position': 'absolute',
        'top': (this._current.y * this._options.tileHeight - this._options.tileHeight) + 'px',
        'width': this._options.width + 'px'
    });
};

DG.Projectile.prototype.shoot = function (x, y, mouseState, shootingMode) {
    var self = this;

    if (shootingMode === 'single') {
        if (mouseState === 'up') {
            this._animationCycle(x, y);
        }
    } else if (shootingMode === 'burst') {
        if (mouseState === 'down') {
            //if (this._current.shootInterval === null) {
                this._animationCycle(x, y);
            
                this._current.shootInterval = setInterval(function () {
                    self._animationCycle(x, y);
                }, 500);
            //}
        } else {
            clearInterval(this._current.shootInterval);
            this._current.shootInterval = null;
        }
    }
};

DG.Projectile.prototype._getDirection = function (x, y) {
    var direction = { 
            cardinality: 'w',
            row: 1
        },
        xDiff = x - this._current.x,
        yDiff = y - this._current.y;
    
    // compute sprite row number and its cardinal direction
    if ((xDiff < 0) && (yDiff === 0)) {
        direction.cardinality = 'w';
        direction.row = 1;
    } else if ((xDiff === 0) && (yDiff < 0)) {
        direction.cardinality = 'n';
        direction.row = 3;
    } else if ((xDiff > 0) && (yDiff === 0)) {
        direction.cardinality = 'e';
        direction.row = 2;
    } else if ((xDiff === 0) && (yDiff > 0)) {
        direction.cardinality = 's';
        direction.row = 0;
    } else if ((xDiff < 0) && (yDiff < 0)) {
        direction.cardinality = 'nw';
        direction.row = 6;
    } else if ((xDiff > 0) && (yDiff < 0)) {
        direction.cardinality = 'ne';
        direction.row = 7;
    } else if ((xDiff < 0) && (yDiff > 0)) {
        direction.cardinality = 'sw';
        direction.row = 5;
    } else if ((xDiff > 0) && (yDiff > 0)) {
        direction.cardinality = 'se';
        direction.row = 4;
    }

    return direction;
};

DG.Projectile.prototype._getDistance = function (start, end) {
    var distance = 0,
        diffX, diffY;

    if (start.x > end.x) {
        diffX = start.x - end.x;
    } else {
        diffX = end.x - start.x;
    }
    
    if (start.y > end.y) {
        diffY = start.y - end.y;
    } else {
        diffY = end.y - start.y;
    }
    
    if (diffX > diffY) {
        distance = diffX;
    } else {
        distance = diffY;
    }
    
    return distance;
};

DG.Projectile.prototype._animationCycle = function (x, y) {
    var self = this,
        direction = this._getDirection(x, y),
        distance = this._getDistance(
            { x: this._current.x, y: this._current.y },
            { x: x, y: y}
        );

    this._current.direction = direction.cardinality;
    this._current.row = direction.row;

    // set appropriate position from sprite
    this._element.css(
        'backgroundPosition',
        (this._current.column * this._options.width) + 'px ' +
        '-' + (this._current.row * this._options.height) + 'px'
    );
    
    this._element.animate(
        {
            left: x * this._options.tileWidth + (this._options.tileHeight / 2),
            top: y * this._options.tileHeight - (this._options.tileHeight / 2)
        }, 
        {
            duration: distance * 50, 
            easing: 'linear',
            step: function() {
            },
            complete: function() {
                self._element.remove();
                self._options.playground.removeEntity(self._options.elementID);
            }
        }
    );
};