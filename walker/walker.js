function Walker(options) {
    this._element = options.element;
    this._current = {
        column: options._currentColumn || 0,
        row: options._currentRow || 0,
        direction: '',
        x: options.start.x || 0,
        y: options.start.y || 0
    };
    
    this._options = {
        sprite: options.sprite || '',
        columnsCount: options.columnsCount || 8,
        rowsCount: options.rowsCount || 8,
        height: options.height || 32,
        width: options.width || 32
    };
    
    this._element.css({
        'backgroundImage': 'url("' + this._options.sprite + '")',
        'height': this._options.height + 'px',
        'left': this._current.x + 'px',
        'position': 'absolute',
        'top': this._current.y + 'px',
        'width': this._options.width + 'px'
    });
    
    this._obstacles = {
        n: {},
        s: {},
        w: {},
        e: {},
        nCount: 0,
        sCount: 0,
        wCount: 0,
        eCount: 0
    };
    
    this._path = [];
};

Walker.prototype.move = function (x, y) {
    var self = this,
        stepCount = 0,
        direction,
        i;

    // stop current animation
    this._element.stop(true, false);
        
    // clear path and add new destination
    this._path = [];
    this._path.push({
        x: x,
        y: y
    });

    for (i = (this._path.length - 1); i >= 0; i--) {        
        // compute sprite direction toward destination position
        direction = this._getDirection(
            this._path[i].x, 
            this._path[i].y
        );
        this._current.direction = direction.cardinality;
        this._current.row = direction.row;
    
        this._element.animate(
            {
                left: x,
                top: y
            }, 
            {
                duration: direction.duration, 
                easing: 'linear',
                step: function() {
                    var position = self._element.position(),
                        stepDirection;
                
                    stepCount++;
                    
                    self._scanObstacles();
                    
                    stepDirection = self._getDirection(
                        position.left,
                        position.top
                    );
                    
                    if (self._isDirectionBlocked(direction, stepDirection)) {
                        self._element.stop(true, false);
                        return;
                    }
                    
                    // change position within sprite after certain amount of steps
                    if (stepCount % 18 === 0) {
                        self._current.x = position.left;
                        self._current.y = position.top;
                    
                        // set appropriate position from sprite
                        self._element.css(
                            'backgroundPosition',
                            (self._current.column * self._options.width) + 'px ' +
                            '-' + (self._current.row * self._options.height) + 'px'
                        );
                        self._current.column++;
                        
                        // go to beginning position within sprite when the end column was reached
                        if(self._current.column === self._options.columnsCount) {
                            self._current.column = 0;
                        }
                    }

                    self._clearObstacles();
                },
                complete: function() {
                    self._path.pop();
                
                    // show first position in current sprite row
                    self._element.css('backgroundPosition', '0px -' + (self._current.row * self._options.height) + 'px');
                }
            }
        );
    }
};

Walker.prototype._getDirection = function (x, y) {
    var direction = { 
            cardinality: 'w',
            row: 1,
            duration: 600
        },
        diffX = x - this._current.x,
        diffY = y - this._current.y,
        posDiffX = diffX,
        posDiffY = diffY;
    
    if (posDiffX < 0) {
        posDiffX = posDiffX * (-1);
    }
    
    if (posDiffY < 0) {
        posDiffY = posDiffY * (-1);
    }
    
    // compute duration
    if (posDiffX > posDiffY) {
        direction.duration = (posDiffX / this._options.height) * 600;
    } else {
        direction.duration = (posDiffY / this._options.height) * 600;
    }

    // compute sprite row number and its cardinal direction
    if ((diffX < 0) && (diffY >= -10) && (diffY <= 22)) {
        direction.cardinality = 'w';
        direction.row = 1;
    } else if ((diffX >= -10) && (diffX <= 22) && (diffY < 0)) {
        direction.cardinality = 'n';
        direction.row = 3;
    } else if ((diffX > 0) && (diffY >= -10) && (diffY <= 22)) {
        direction.cardinality = 'e';
        direction.row = 2;
    } else if ((diffX >= -0) && (diffX <= 22) && (diffY > 0)) {
        direction.cardinality = 's';
        direction.row = 0;
    } else if ((diffX < 0) && (diffY < 0)) {
        direction.cardinality = 'nw';
        direction.row = 6;
    } else if ((diffX > 0) && (diffY < 0)) {
        direction.cardinality = 'ne';
        direction.row = 7;
    } else if ((diffX < 0) && (diffY > 0)) {
        direction.cardinality = 'sw';
        direction.row = 5;
    } else if ((diffX > 0) && (diffY > 0)) {
        direction.cardinality = 'se';
        direction.row = 4;
    }
    
    return direction;
};

Walker.prototype._scanObstacles = function () {
    var offset = this._element.offset(),
        x = offset.left, 
        y = offset.top,
        elem, i, len;
        
    // check North direction
    for (i = 0, len = this._options.width; i < len; i++) {
        elem = document.elementFromPoint(x + i, y - 1);
        
        if (elem && (elem.id !== 'playground')) {
            if (this._obstacles.n[elem.id] === undefined) {
                this._obstacles.n[elem.id] = elem;
                this._obstacles.nCount++;
            }
        }
    }
    
    // check South direction
    for (i = 0, len = this._options.width; i < len; i++) {
        // +3 because of top and bottom border
        elem = document.elementFromPoint(x + i, y + 3 + this._options.height);
        
        if (elem && (elem.id !== 'playground')) {
            if (this._obstacles.s[elem.id] === undefined) {
                this._obstacles.s[elem.id] = elem;
                this._obstacles.sCount++;
            }
        }
    }
    
    // check West direction
    for (i = 0, len = this._options.height; i < len; i++) {
        elem = document.elementFromPoint(x - 1, y + i);
        
        if (elem && (elem.id !== 'playground')) {
            if (this._obstacles.w[elem.id] === undefined) {
                this._obstacles.w[elem.id] = elem;
                this._obstacles.wCount++;
            }
        }
    }
    
    // check East direction
    for (i = 0, len = this._options.height; i < len; i++) {
        elem = document.elementFromPoint(x + 3 + this._options.width, y + i);
        
        if (elem && (elem.id !== 'playground')) {
            if (this._obstacles.e[elem.id] === undefined) {
                this._obstacles.e[elem.id] = elem.id;
                this._obstacles.eCount++;
            }
        }
    }
    
    var s = 'N: <br />';
    for (var item in this._obstacles.n) {
        s += item + '<br />';
    }
    
    s += 'S: <br />';
    for (var item in this._obstacles.s) {
        s += item + '<br />';
    }
    
    s += 'W: <br />';
    for (var item in this._obstacles.w) {
        s += item + '<br />';
    }
    
    s += 'E: <br />';
    for (var item in this._obstacles.e) {
        s += item + '<br />';
    }
    
    $("#debug").html(s);
};

Walker.prototype._clearObstacles = function (x, y) {
    this._obstacles = {
        n: {},
        s: {},
        w: {},
        e: {},
        nCount: 0,
        sCount: 0,
        wCount: 0,
        eCount: 0
    };
};

Walker.prototype._isDirectionBlocked = function (original, step) {
    var i, len;
    
    for (i = 0, len = original.cardinality.length; i < len; i++) {
        var count = this._obstacles['' + original.cardinality[i] + 'Count'];
            
        
        if (count > 0) {
            return true;
        }
    }
    
    return false;
};