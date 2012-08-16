function Walker(options) {
    this._current = {
        column: options._currentColumn || 0,
        row: options._currentRow || 0,
        direction: '',
        x: Math.floor(options.start.x) || 0,
        y: Math.floor(options.start.y) || 0,
        // flag to determine if entity is in destroy process
        // e.g. delete animation is in progress and object still exists
        // so no other action should be executed
        isDestroying: false,
        // flag to determine if entity is currently performing
        // step action, e.g. in this situation it shouldn't listen to
        // invoked keyboard navigation changes in order to finish move
        isStepping: false,
        // flag to determine if entity is currently performing move action
        // e.g. this is useful to know when rotate shouldn't affect
        // current sprite animation
        isMoving: false,
        // holds value of last step direction to determine if first sprite
        // column should be rendered to indicate idle movement
        lastStepDirection: 0
    };
    
    this._options = {
        elementID: options.elementID || '',
        cssClasses: options.cssClasses || '',
        sprite: options.sprite || '',
        columnsCount: options.columnsCount || 8,
        rowsCount: options.rowsCount || 8,
        height: options.height || 32,
        width: options.width || 32,
        tileWidth: options.tileWidth || 16,
        tileHeight: options.tileHeight || 16,
        playground: options.playground || false
    };
    
    // if playground is present, append DOM element manually and register
    // entity to track movement changes
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
    
    // expose element id
    this.id = this._options.elementID;
    
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
    
    this._path = [];
    
    this._createAnimation();
};

Walker.prototype.move = function (left, top) {
    var self = this,
        x = Math.floor(left / this._options.tileWidth),
        y = Math.floor(top / this._options.tileHeight),
        iteration = 0;
  
    if ((this._current.x !== x) || (this._current.y !== y) && (!this._current.isDestroying)) {
        // stop current animation
        this._element.stop(true, false);
            
        this._path = this._options.playground.findPath(
            { x: this._current.x, y: this._current.y },
            { x: x, y: y }
        );
           
        if (this._path.length > 0) {
            this._current.isMoving = true;
            
            (function animate(iteration) {
                self._animationCycle(iteration, function () {
                    iteration++;
                
                    if (iteration < self._path.length) {
                        animate(iteration);
                    } else {
                        self._current.isMoving = false;
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

Walker.prototype.step = function (direction) {
    var self = this,
        zIndexChange = 0,
        stepCount = 0,
        row = 0,
        nextX = this._current.x, 
        nextY = this._current.y;    
        
    this._current.lastStepDirection = direction;
        
    if (!this._current.isStepping) {
        this._current.isStepping = true;
        
        // get row number and next coordinates based on direction
        if (direction === 'w') {
            row = 1;
            nextX--;
        } else if (direction === 'n') {
            row = 3;
            nextY--;
        } else if (direction === 'e') {
            row = 2;
            nextX++;
        } else if (direction === 's') {
            row = 0;
            nextY++;
        } else if (direction === 'nw') {
            row = 6;
            nextX--;
            nextY--;
        } else if (direction === 'ne') {
            row = 7;
            nextX++;
            nextY--;
        } else if (direction === 'sw') {
            row = 5;
            nextX--;
            nextY++;
        } else if (direction === 'se') {
            row = 4;
            nextX++;
            nextY++;
        } else {
            this._current.isStepping = false;
        }
        
        if ((this._current.x !== nextX) || (this._current.y !== nextY) && (!this._current.isDestroying)) {        
            if (this._options.playground.checkPosition(nextX, nextY)) {
                this._current.x = nextX;
                this._current.y = nextY;
            
                if (this._options.playground !== false) {
                    this._options.playground.updateEntityPosition(
                        this._options.elementID,
                        this._current.x,
                        this._current.y
                    );
                
                    // change z-index to correctly show overlay between multiple entities
                    zIndexChange = this._options.playground.zIndexStatus(nextX, nextY);
                    
                    if (zIndexChange === 1) {
                        this._element.css('zIndex', 9999);
                    } else if (zIndexChange === -1) {
                        this._element.css('zIndex', 0);
                    }
                }
                
                this._current.direction = direction;
                this._current.row = row;
                
                this._element.animate(
                    {
                        left: nextX * this._options.tileWidth,
                        top: nextY * this._options.tileHeight - this._options.tileHeight
                    }, 
                    {
                        duration: 390, 
                        easing: 'linear',
                        step: function() {
                            position = self._element.position(),
                            stepCount++;
                            
                            // change position within sprite after certain amount of steps
                            if (stepCount % 15 === 0) {
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
                            self._current.isStepping = false;
                            
                            if (self._current.lastStepDirection === 0) {
                                // show first position in current sprite row
                                self._current.column = 0;
                                self._element.css(
                                    'backgroundPosition', 
                                    '0px -' + (self._current.row * self._options.height) + 'px'
                                );
                            }
                        }
                    }
                );
            } else {
                if (this._current.lastStepDirection === 0) {
                    this._current.isStepping = false;
                }
                // stop current animation
                this._element.stop(true, false);
                // show first position in current sprite row
                this._current.column = 0;
                this._element.css('backgroundPosition', '0px -' + (this._current.row * this._options.height) + 'px');
            }
        }
    }
};

Walker.prototype.rotate = function (left, top) {
    var direction = this._getDirection(
        Math.floor(left / this._options.tileWidth), 
        Math.floor(top / this._options.tileHeight)
    );
    
    if (!this._current.isStepping && 
        (this._current.lastStepDirection === 0) &&
        !this._current.isMoving && 
        !this._current.isDestroying) {
        this._current.column = 0;
        this._current.direction = direction.cardinality;
        this._current.row = direction.row;
    
        this._element.css(
            'backgroundPosition', 
            '0px -' + (this._current.row * this._options.height) + 'px'
        );
    }
};

Walker.prototype.destroy = function (callback) {
    var self = this,
        stepCount = 0;
        
    this._current.isDestroying = true;
        
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
            left: this._current.x * this._options.tileWidth,
            top: this._current.y * this._options.tileHeight - this._options.tileHeight
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
                self._element.remove();
                
                if (self._options.playground !== false) {
                    self._options.playground.removeEntity(self._options.elementID);
                }
                
                callback();
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

    // set appropriate sprite position
    this._element.css(
        'backgroundPosition',
        (this._current.column * this._options.width) + 'px ' +
        '-' + (this._current.row * this._options.height) + 'px'
    );
    
    this._element.animate(
        {
            left: this._current.x * this._options.tileWidth,
            top: this._current.y * this._options.tileHeight - this._options.tileHeight
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
        zIndexChange,
        direction,
        position;

    this._current.x = this._path[iteration][0];
    this._current.y = this._path[iteration][1];
    
    if (this._options.playground !== false) {
        this._options.playground.updateEntityPosition(
            this._options.elementID,
            this._current.x,
            this._current.y
        );
    }
    
    // animate only if walker can move to next location
    if ((iteration + 1) < this._path.length) {
        nextX = this._path[iteration + 1][0];
        nextY = this._path[iteration + 1][1];
        
        if (this._options.playground !== false) {
            // change z-index to correctly show overlay between multiple entities
            zIndexChange = this._options.playground.zIndexStatus(nextX, nextY);
            
            if (zIndexChange === 1) {
                this._element.css('zIndex', 9999);
            } else if (zIndexChange === -1) {
                this._element.css('zIndex', 0);
            }
        }
        
        direction = this._getDirection(nextX, nextY);
        
        this._current.direction = direction.cardinality;
        this._current.row = direction.row;
        
        this._element.animate(
            {
                left: nextX * this._options.tileWidth,
                top: nextY * this._options.tileHeight - this._options.tileHeight
            }, 
            {
                duration: 400, 
                easing: 'linear',
                step: function() {
                    position = self._element.position(),
                    stepCount++;
                    
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