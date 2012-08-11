$(document).ready(function() {

    var playground = new Playground({
        id: 'playground',
        map: {},
        tile: {}
    });

    playground.printMap();
    
    var actor1 = new Walker({
        id: 'actor1',
        sprite: '../sprites/lemming.png',
        start: {
            x: 16,
            y: 16
        }
    });
    
    var actor2 = new Walker({
        id: 'actor2',
        sprite: '../sprites/lemming.png',
        start: {
            x: 128,
            y: 128
        }
    });
    
    var actor3 = new Walker({
        id: 'actor3',
        sprite: '../sprites/lemming.png',
        start: {
            x: 165,
            y: 128
        }
    });
    
    var actor4 = new Walker({
        id: 'actor4',
        sprite: '../sprites/lemming.png',
        start: {
            x: 200,
            y: 128
        }
    });
    
    $('#playground').click(function(e) {
        actor1.move(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    });
});