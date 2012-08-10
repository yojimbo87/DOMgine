$(document).ready(function() {

    var actor1 = new Walker({
        element: $("#actor1"),
        sprite: "../sprites/lemming.png",
        columnsCount: 8,
        currentRow: 0,
        start: {
            x: 0,
            y: 0
        }
    });
    
    var actor2 = new Walker({
        element: $("#actor2"),
        sprite: "../sprites/lemming.png",
        columnsCount: 8,
        currentRow: 0,
        start: {
            x: 128,
            y: 128
        }
    });
    
    $("#playground").click(function(e) {
        actor1.move(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    });
});