$(document).ready(function() {

    var actor1 = new Walker({
        element: $("#actor1"),
        sprite: "../sprites/lemming.png",
        height: 32,
        width: 32,
        columnsCount: 8,
        currentRow: 0
    });
    
    $("#playground").click(function(e) {
        
        //actor1.move(e.offsetX, e.offsetY);
        actor1.move(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    });
});