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
        N: {},
        S: {},
        W: {},
        E: {}
    };
    
    this._path = [];
};

Walker.prototype.move = function (destinationX, destinationY) {
    var self = this,
        diffX = destinationX - self._current.x,
        diffY = destinationY - self._current.y,
        stepCount = 0,
        direction,
        i, len;

    this._path.push({
        x: destinationX,
        y: destinationY
    });
    
    // stop current animation
    $(this._element).stop(true, false);
    
    // compute sprite direction toward destination position
    direction = this._getDirection(diffX, diffY);
    this._current.direction = direction.cardinality;
    this._current.row = direction.row;
    
    /*$("#debug").html(
        "from: " + self._current.x + " " + self._current.y +
        "<br /> to: " + destinationX + " " + destinationY +
        "<br /> diff: " + diffX + " " + diffY + 
        "<br /> dir: " + self._current.direction +
        "<br /> dur: " + duration +
        "<br />"
    );*/
    
    $(this._element).animate(
        {
            left: destinationX,
            top: destinationY
        }, 
        {
            duration: direction.duration, 
            easing: 'linear',
            step: function() {
                var position;
            
                stepCount++;
                
                self._scanObstacles();
                
                // change position within sprite after certain amount of steps
                if (stepCount % 18 === 0) {
                    position = self._element.position()
                    self._current.x = position.left;
                    self._current.y = position.top;
                
                    //$("#debug").append("step " + self._current.x + " " +  self._current.y + "<br />");
                    
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
                // show first position in current sprite row
                self._element.css('backgroundPosition', '0px -' + (self._current.row * self._options.height) + 'px');
            }
        }
    );
};

Walker.prototype._getDirection = function (diffX, diffY) {
    var direction = { 
            cardinality: 'w',
            row: 1,
            duration: 600
        },
        posDiffX = diffX,
        posDiffY = diffY;
    
    if (posDiffX < 0) {
        posDiffX = posDiffX * (-1);
    }
    
    if (posDiffY < 0) {
        posDiffY = posDiffY * (-1);
    }
    
    if (posDiffX > posDiffY) {
        direction.duration = (posDiffX / this._options.height) * 600;
    } else {
        direction.duration = (posDiffY / this._options.height) * 600;
    }

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
        elem, i;
        
    // check North direction
    for (i = 0; i < this._options.width; i++) {
        elem = document.elementFromPoint(x + i, y - 1);
        
        if (elem && (elem.id !== 'playground')) {
            if (this._obstacles.N[elem.id] === undefined) {
                this._obstacles.N[elem.id] = elem;
            }
        }
    }
    
    // check South direction
    for (i = 0; i < this._options.width; i++) {
        // +3 because of top and bottom border
        elem = document.elementFromPoint(x + i, y + 3 + this._options.height);
        
        if (elem && (elem.id !== 'playground')) {
            if (this._obstacles.S[elem.id] === undefined) {
                this._obstacles.S[elem.id] = elem;
            }
        }
    }
    
    // check West direction
    for (i = 0; i < this._options.height; i++) {
        elem = document.elementFromPoint(x - 1, y + i);
        
        if (elem && (elem.id !== 'playground')) {
            if (this._obstacles.W[elem.id] === undefined) {
                this._obstacles.W[elem.id] = elem;
            }
        }
    }
    
    // check East direction
    for (i = 0; i < this._options.height; i++) {
        elem = document.elementFromPoint(x + 3 + this._options.width, y + i);
        
        if (elem && (elem.id !== 'playground')) {
            if (this._obstacles.E[elem.id] === undefined) {
                this._obstacles.E[elem.id] = elem.id;
            }
        }
    }
    
    var s = 'N: <br />';
    for (var item in this._obstacles.N) {
        s += item + '<br />';
    }
    
    s += 'S: <br />';
    for (var item in this._obstacles.S) {
        s += item + '<br />';
    }
    
    s += 'W: <br />';
    for (var item in this._obstacles.W) {
        s += item + '<br />';
    }
    
    s += 'E: <br />';
    for (var item in this._obstacles.E) {
        s += item + '<br />';
    }
    
    $("#debug").html(s);
};

Walker.prototype._clearObstacles = function (x, y) {
    this._obstacles = {
        N: {},
        S: {},
        W: {},
        E: {}
    };
};