$(document).ready(function() {

    playground = new Playground({
        id: 'playground',
        map: {},
        tile: {}
    });
    
    var actor1 = new Walker({
        id: 'actor1',
        sprite: '../sprites/lemming.png',
        start: {
            x: 1,
            y: 1
        },
        mapMovement: true
    });
    
    var actor2 = new Walker({
        id: 'actor2',
        sprite: '../sprites/lemming.png',
        start: {
            x: 4,
            y: 4
        }
    });
    
    var actor3 = new Walker({
        id: 'actor3',
        sprite: '../sprites/lemming.png',
        start: {
            x: 6,
            y: 4
        }
    });
    
    var actor4 = new Walker({
        id: 'actor4',
        sprite: '../sprites/lemming.png',
        start: {
            x: 8,
            y: 4
        }
    });
    
    playground.init();
    playground.printMap();
    
    $('#playground').click(function(e) {
        actor1.move(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        
        playground.printMap();
    });
});