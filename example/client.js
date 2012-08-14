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
    
    var actor2 = new Walker({
        elementID: 'actor2',
        sprite: '../sprites/lemming-johny.png',
        start: {
            x: 4,
            y: 4
        },
        playground: playground
    });
    
    var actor3 = new Walker({
        elementID: 'actor3',
        sprite: '../sprites/lemming-johny.png',
        start: {
            x: 6,
            y: 4
        },
        playground: playground
    });
    
    var actor4 = new Walker({
        elementID: 'actor4',
        sprite: '../sprites/lemming-johny.png',
        start: {
            x: 8,
            y: 4
        },
        playground: playground
    });
    
    $('#playground').click(function(e) {
        actor1.move(
            e.pageX - this.offsetLeft, 
            e.pageY - this.offsetTop
        );
    });
    
    setTimeout(function () {
        actor4.destroy(function () {
            
        });
    }, 5000);
});