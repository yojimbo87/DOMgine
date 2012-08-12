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
    
    this._path = [];
};

Walker.prototype.move = function (left, top) {
    var self = this,
        x = Math.floor(left / this._options.width),
        y = Math.floor(top / this._options.height),
        iteration = 0;
  
    // stop current animation
    this._element.stop(true, false);
        
    this._path = playground.findPath(
        { x: this._current.x, y: this._current.y },
        { x: x, y: y }
    );
       
    if (this._path.length > 0) {
        (function animate(iteration) {
            self._animationCycle(iteration, function () {
                iteration++;
            
                if (iteration < self._path.length) {
                    animate(iteration);
                }
            });
        })(iteration);
    } else {
        // show first position in current sprite row
        this._element.column = 0;
        this._element.css('backgroundPosition', '0px -' + (this._current.row * this._options.height) + 'px');
    }
};

Walker.prototype._getDirection = function (x, y) {
    var direction = { 
            cardinality: 'w',
            row: 1,
            duration: 800
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
        direction.duration = xDur * 800;
    } else {
        direction.duration = yDur * 800;
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

Walker.prototype._animationCycle = function (iteration, callback) {
    var self = this,
        stepCount = 0,
        direction,
        position;

    this._current.x = this._path[iteration][0];
    this._current.y = this._path[iteration][1];
    
    if ((iteration + 1) < this._path.length) {
        nextX = this._path[iteration + 1][0];
        nextY = this._path[iteration + 1][1];
    } else {
        nextX = this._current.x;
        nextY = this._current.y;
    }
    
    direction = this._getDirection(nextX, nextY);
    
    if ((iteration + 1) < this._path.length) {
        this._current.direction = direction.cardinality;
        this._current.row = direction.row;
    }
    
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

                if (self._options.mapMovement === true) {
                    playground.updateEntityPosition(self._element.attr('id'));
                }
                
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
                // show first position in current sprite row
                self._element.column = 0;
                self._element.css('backgroundPosition', '0px -' + (self._current.row * self._options.height) + 'px');
                
                callback();
            }
        }
    );
};