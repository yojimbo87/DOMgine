function Walker(options) {
    this._element = options.element;
    this.current = {
        column: options.currentColumn || 0,
        row: options.currentRow || 0,
        direction: "",
        x: 0,//this._element.position().left,
        y: 0//this._element.position().top
    };
    
    this._options = {
        sprite: options.sprite || "",
        columnsCount: options.columnsCount || 6,
        rowsCount: options.rowsCount || 8,
        height: options.height || 32,
        width: options.width || 32
    };
    
    this._element.css("backgroundImage", "url('" + this._options.sprite + "')");
}



Walker.prototype.move = function(destinationX, destinationY) {
    var self = this,
        diffX = destinationX - self.current.x,
        diffY = destinationY - self.current.y,
        stepCount = 0,
        duration = 0,
        i, len;

    // stop current animation
    $(this._element).stop(true, false);
    
    var posDiffX = diffX,
        posDiffY = diffY;
    
    if(posDiffX < 0) {
        posDiffX = posDiffX * (-1);
    }
    
    if(posDiffY < 0) {
        posDiffY = posDiffY * (-1);
    }
    
    if(posDiffX > posDiffY) {
        duration = (posDiffX / this._options.height) * 600;
    } else {
        duration = (posDiffY / this._options.height) * 600;
    }
    
    // compute sprite direction toward destination position
    if((diffX < 0) && (diffY >= -10) && (diffY <= 22)) {
        this.current.direction = "w";
        this.current.row = 1;
    } else if((diffX >= -10) && (diffX <= 22) && (diffY < 0)) {
        this.current.direction = "n";
        this.current.row = 3;
    } else if((diffX > 0) && (diffY >= -10) && (diffY <= 22)) {
        this.current.direction = "e";
        this.current.row = 2;
    } else if((diffX >= -0) && (diffX <= 22) && (diffY > 0)) {
        this.current.direction = "s";
        this.current.row = 0;
    } else if((diffX < 0) && (diffY < 0)) {
        this.current.direction = "nw";
        this.current.row = 6;
    } else if((diffX > 0) && (diffY < 0)) {
        this.current.direction = "ne";
        this.current.row = 7;
    } else if((diffX < 0) && (diffY > 0)) {
        this.current.direction = "sw";
        this.current.row = 5;
    } else if((diffX > 0) && (diffY > 0)) {
        this.current.direction = "se";
        this.current.row = 4;
    }
    
    $("#debug").html(
        "from: " + self.current.x + " " + self.current.y +
        "<br /> to: " + destinationX + " " + destinationY +
        "<br /> diff: " + diffX + " " + diffY + 
        "<br /> dir: " + self.current.direction +
        "<br /> dur: " + duration +
        "<br />"
    );
    
    $(this._element).animate(
        {
            left: destinationX,
            top: destinationY
        }, 
        {
            duration: duration, 
            easing: "linear",
            step: function() {
                stepCount++;
                if(stepCount % 18 === 0) {
                    self.current.x = self._element.position().left;
                    self.current.y = self._element.position().top;
                
                    $("#debug").append("step " + self.current.x + " " +  self.current.y + "<br />");
                
                    self._element.css(
                        "backgroundPosition",
                        (self.current.column * self._options.width) + "px " +
                        "-" + (self.current.row * self._options.height) + "px"
                    );
                    
                    self.current.column++;
        
                    if(self.current.column === self._options.columnsCount) {
                        self.current.column = 0;
                    }
                }
            },
            complete: function() {
                self._element.css(
                    "backgroundPosition",
                    "0px " +
                    "-" + (self.current.row * self._options.height) + "px"
                );
            }
        }
    );
    
    /*setInterval(function() {
    
        self._element.css(
            "backgroundPosition",
            (self._current.column * self._options.width) + "px " +
            "-" + (self._current.row * self._options.height) + "px"
        );

        self._currentColumn++;
        
        if(self._current.column === self._options.columnsCount) {
            self._current.column = 1;
        } 
        
    }, 200);*/
};