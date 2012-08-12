function Walker(options) {
    this._element = $('#' + options.id);
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
        width: options.width || 32,
        mapMovement: options.mapMovement || false
    };
    
    this._element.css({
        'backgroundImage': 'url("' + this._options.sprite + '")',
        'height': this._options.height + 'px',
        'left': (this._current.x * this._options.width) + 'px',
        'position': 'absolute',
        'top': (this._current.y * this._options.height) + 'px',
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

Walker.prototype.move = function (left, top) {
    var self = this,
        x = Math.floor(left / this._options.width),
        y = Math.floor(top / this._options.height),
        stepCount = 0,
        direction,
        position,
        nextX, nextY,
        i, len;

    // stop current animation
    this._element.stop(true, false);
        
    // clear path and add new destination
    //this._path = [];
    /* this._path.push({
        x: x,
        y: y
    });*/
    
    this._path = playground.findPath(
        { x: this._current.x, y: this._current.y },
        { x: x, y: y }
    );
    
    
    $('#map').html(JSON.stringify(this._path));

    for (i = 0, len = this._path.length; i < len; i++) {    
        this._current.x = this._path[i][0];
        this._current.y = this._path[i][1];
        
        if ((i + 1) < len) {
            nextX = this._path[i + 1][0];
            nextY = this._path[i + 1][1];
        } else {
            nextX = this._current.x;
            nextY = this._current.y;
        }
        
        direction = this._getDirection(nextX, nextY);
        
        this._current.direction = direction.cardinality;
        this._current.row = direction.row;
        
        this._element.animate(
            {
                left: nextX * this._options.width,
                top: nextY * this._options.height
            }, 
            {
                duration: direction.duration, 
                easing: 'linear',
                step: function() {
                    position = self._element.position(),
                    stepCount++;

                    //if (self._options.mapMovement === true) {
                    //    playground.updateEntityPosition(self._element.attr('id'));
                    //}
                    
                    // change position within sprite after certain amount of steps
                    if (stepCount % 18 === 0) {
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
                },
                complete: function() {
                    //self._path.shift();
                
                    // show first position in current sprite row
                    self._element.column = 0;
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
        xDiff = x - this._current.x,
        yDiff = y - this._current.y,
        xDur = xDiff,
        yDur = yDiff;
    
    // x and y can't have negative values when computing duration
    if (xDur < 0) {
        xDur = xDur * (-1);
    }
    
    if (yDur < 0) {
        yDur = yDur * (-1);
    }
    
    // compute duration
    if (xDur > yDur) {
        direction.duration = xDur * 600;
    } else {
        direction.duration = yDur * 600;
    }
    
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

Walker.prototype._scanObstacles = function () {
    var offset = this._element.offset(),
        obstacles = this._obstacles,
        x = offset.left, 
        y = offset.top,
        elem, i, len;
        
    // check North direction
    for (i = 0, len = this._options.width; i < len; i++) {
        elem = document.elementFromPoint(
            Math.round(x + i), 
            Math.floor(y - 1)
        );
        
        if (elem && (elem.id !== 'playground')) {
            if (obstacles.n[elem.id] === undefined) {
                obstacles.n[elem.id] = elem;
                obstacles.nCount++;
            }
        }
    }
    
    // check South direction
    for (i = 0, len = this._options.width; i < len; i++) {
        elem = document.elementFromPoint(
            Math.round(x + i), 
            Math.floor(y + 1 + this._options.height)
        );
        
        if (elem && (elem.id !== 'playground')) {
            if (obstacles.s[elem.id] === undefined) {
                obstacles.s[elem.id] = elem;
                obstacles.sCount++;
            }
        }
    }
    
    // check West direction
    for (i = 0, len = this._options.height; i < len; i++) {
        elem = document.elementFromPoint(
            Math.floor(x - 1), 
            Math.round(y + i)
        );
        
        if (elem && (elem.id !== 'playground')) {
            if (obstacles.w[elem.id] === undefined) {
                obstacles.w[elem.id] = elem;
                obstacles.wCount++;
            }
        }
    }
    
    // check East direction
    for (i = 0, len = this._options.height; i < len; i++) {
        elem = document.elementFromPoint(
            Math.floor(x + 1 + this._options.width), 
            Math.round(y + i)
        );
        
        if (elem && (elem.id !== 'playground')) {
            if (obstacles.e[elem.id] === undefined) {
                obstacles.e[elem.id] = elem.id;
                obstacles.eCount++;
            }
        }
    }
    
    var s = 'N: <br />';
    for (var item in obstacles.n) {
        s += item + '<br />';
    }
    
    s += 'S: <br />';
    for (var item in obstacles.s) {
        s += item + '<br />';
    }
    
    s += 'W: <br />';
    for (var item in obstacles.w) {
        s += item + '<br />';
    }
    
    s += 'E: <br />';
    for (var item in obstacles.e) {
        s += item + '<br />';
    }
    
    $("#debug").html(s);
};

Walker.prototype._isDirectionBlocked = function (direction) {
    var result = false,
        i, len, obstaclesCount;
    
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
    
    this._scanObstacles();
    
    for (i = 0, len = direction.cardinality.length; i < len; i++) {
        obstaclesCount = this._obstacles['' + direction.cardinality[i] + 'Count'];
            
        if (obstaclesCount > 0) {
            result = true;
            break;
        }
    }
    
    return result;
};

Walker.prototype._findDirection = function (direction) {
    
};