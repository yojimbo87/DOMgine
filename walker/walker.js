function Walker(options) {
    this._current = {
        column: options._currentColumn || 0,
        row: options._currentRow || 0,
        direction: '',
        x: Math.floor(options.start.x) || 0,
        y: Math.floor(options.start.y) || 0
    };
    
    this._options = {
        elementID: options.elementID || '',
        sprite: options.sprite || '',
        columnsCount: options.columnsCount || 8,
        rowsCount: options.rowsCount || 8,
        height: options.height || 32,
        width: options.width || 32,
        playground: options.playground || false
    };
    
    if (this._options.playground !== false) {
        $('#' + this._options.playground._options.elementID).append(
           '<div id="' + this._options.elementID + '"></div>'
        );
    }
    
    this._element = $('#' + this._options.elementID);
    
    this._element.css({
        'backgroundImage': 'url("' + this._options.sprite + '")',
        'height': this._options.height + 'px',
        'left': (this._current.x * this._options.width) + 'px',
        'position': 'absolute',
        'top': (this._current.y * this._options.height) + 'px',
        'width': this._options.width + 'px'
    });
    
    this._path = [];
    
    this._createAnimation();
};

Walker.prototype.move = function (left, top) {
    var self = this,
        x = Math.floor(left / this._options.width),
        y = Math.floor(top / this._options.height),
        iteration = 0;
  
    if ((this._current.x !== x) || (this._current.y !== y)) {
        // stop current animation
        this._element.stop(true, false);
            
        this._path = this._options.playground.findPath(
            { x: this._current.x, y: this._current.y },
            { x: x, y: y }
        );
           
        if (this._path.length > 0) {
            (function animate(iteration) {
                self._animationCycle(iteration, function () {
                    iteration++;
                
                    if (iteration < self._path.length) {
                        animate(iteration);
                    } else {
                        // show first position in current sprite row
                        self._current.column = 0;
                        self._element.css(
                            'backgroundPosition', 
                            '0px -' + (self._current.row * self._options.height) + 'px'
                        );
                    }
                });
            })(iteration);
        } else {
            // show first position in current sprite row
            this._current.column = 0;
            this._element.css('backgroundPosition', '0px -' + (this._current.row * this._options.height) + 'px');
        }
    }
};

Walker.prototype.destroy = function () {
    var self = this,
        stepCount = 0;
        
    // stop current animation
    this._element.stop(true, false);
        
    this._current.column = 0;
    this._current.row = 8;

    // set appropriate position from sprite
    this._element.css(
        'backgroundPosition',
        (this._current.column * this._options.width) + 'px ' +
        '-' + (this._current.row * this._options.height) + 'px'
    );
    
    this._element.animate(
        {
            left: this._current.x * this._options.width,
            top: this._current.y * this._options.height
        }, 
        {
            duration: 800, 
            easing: 'linear',
            step: function() {
                stepCount++;
                
                // change position within sprite after certain amount of steps
                if (stepCount % 15 === 0) {
                    // set appropriate position from sprite
                    self._element.css(
                        'backgroundPosition',
                        '-' + (self._current.column * self._options.width) + 'px ' +
                        '-' + (self._current.row * self._options.height) + 'px'
                    );
                    
                    $('#map').append(self._current.column + ' ' + self._current.row + '<br />');
                    
                    self._current.column++;
                }
            },
            complete: function() {
                //self._element.css('background', 'transparent');
                self._element.remove();
            }
        }
    );
};

Walker.prototype._createAnimation = function() {
    var self = this,
        stepCount = 0;
        
    // stop current animation
    this._element.stop(true, false);
        
    this._current.column = 0;
    this._current.row = 9;

    // set appropriate position from sprite
    this._element.css(
        'backgroundPosition',
        (this._current.column * this._options.width) + 'px ' +
        '-' + (this._current.row * this._options.height) + 'px'
    );
    
    this._element.animate(
        {
            left: this._current.x * this._options.width,
            top: this._current.y * this._options.height
        }, 
        {
            duration: 800, 
            easing: 'linear',
            step: function() {
                stepCount++;
                
                // change position within sprite after certain amount of steps
                if (stepCount % 15 === 0) {
                    // set appropriate position from sprite
                    self._element.css(
                        'backgroundPosition',
                        '-' + (self._current.column * self._options.width) + 'px ' +
                        '-' + (self._current.row * self._options.height) + 'px'
                    );
                    
                    self._current.column++;
                }
            },
            complete: function() {
                self._current.column = 0;
                self._current.row = 0;

                // set appropriate position from sprite
                self._element.css(
                    'backgroundPosition',
                    (self._current.column * self._options.width) + 'px ' +
                    '-' + (self._current.row * self._options.height) + 'px'
                );
            }
        }
    );
};

Walker.prototype._getDirection = function (x, y) {
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

Walker.prototype._animationCycle = function (iteration, callback) {
    var self = this,
        stepCount = 0,
        nextX, nextY,
        direction,
        position;

    this._current.x = this._path[iteration][0];
    this._current.y = this._path[iteration][1];
    
    // animate only if walker can move to next location
    if ((iteration + 1) < this._path.length) {
        nextX = this._path[iteration + 1][0];
        nextY = this._path[iteration + 1][1];
        
        direction = this._getDirection(nextX, nextY);
        
        this._current.direction = direction.cardinality;
        this._current.row = direction.row;
        
        this._element.animate(
            {
                left: nextX * this._options.width,
                top: nextY * this._options.height
            }, 
            {
                duration: 800, 
                easing: 'linear',
                step: function() {
                    position = self._element.position(),
                    stepCount++;

                    /*if (self._options.playground !== false) {
                        self._options.playground.updateEntityPosition(self._element.attr('id'));
                    }*/
                    
                    // change position within sprite after certain amount of steps
                    if (stepCount % 16 === 0) {
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
                    callback();
                }
            }
        );
    } else {
        callback();
    }
};