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
        position,
        stepDirection,
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
        // compute sprite direction towards destination position
        direction = this._getDirection(
            this._path[i].x, 
            this._path[i].y
        );
        this._current.direction = direction.cardinality;
        this._current.row = direction.row;

        if (this._isDirectionBlocked(direction)) {
            this._element.stop(true, false);
            // show first position in current sprite row
            this._current.column = 0;
            this._element.css('backgroundPosition', '0px -' + (this._current.row * this._options.height) + 'px');
            this._findDirection(direction);
            
            return;
        }
        
        this._element.animate(
            {
                left: x,
                top: y
            }, 
            {
                duration: direction.duration, 
                easing: 'linear',
                step: function() {
                    position = self._element.position(),
                    stepCount++;

                    stepDirection = self._getDirection(
                        position.left,
                        position.top
                    );
                    
                    if (self._options.mapMovement === true) {
                        playground.updateEntityPosition(self._element.attr('id'));
                        //playground.printMap();
                    }
                    
                    if (self._isDirectionBlocked(direction)) {
                        self._element.stop(true, false);
                        // show first position in current sprite row
                        self._current.column = 0;
                        self._element.css('backgroundPosition', '0px -' + (self._current.row * self._options.height) + 'px');
                        self._findDirection(stepDirection);
                        
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
                },
                complete: function() {
                    self._path.pop();
                
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