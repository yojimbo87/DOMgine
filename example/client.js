$(document).ready(function() {

    var playground = new Playground({
        elementID: 'playground',
        map: {},
        tile: {}
    });
    
    var actor1 = new Walker({
        elementID: 'actor1',
        sprite: '../sprites/lemming-joe.png',
        start: {
            x: 1,
            y: 1
        },
        playground: playground
    });
    
    playground.printMap();
    
    /*var actor2 = new Walker({
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
    });*/
    
    $('#playground').click(function(e) {
        actor1.move(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    });
    
    setTimeout(function () {
        actor1.destroy(function () {
            playground.printMap();
        });
    }, 5000);
});