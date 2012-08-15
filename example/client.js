$(document).ready(function() {

    var playground = new Playground({
        elementID: 'playground'
    });
    
    var actor1 = new Walker({
        elementID: 'actor1',
        cssClasses: 'human',
        sprite: '../sprites/lemming-joe.png',
        start: {
            x: 2,
            y: 2
        },
        playground: playground
    });
    
    var actor2 = new Walker({
        elementID: 'actor2',
        cssClasses: 'human',
        sprite: '../sprites/lemming-johny.png',
        start: {
            x: 4,
            y: 4
        },
        playground: playground
    });
    
    playground.onMouseNavigation(function (left, top) {
        actor1.move(left, top);
    });
    
    var map = $('#map');
    var count = 1;
    playground.onKeyboardNavigation(function (direction) {
        count++;
        map.html(direction + ' ' + count);
        actor2.step(direction);
    });
    
    /*var actor3 = new Walker({
        elementID: 'actor3',
        cssClasses: 'human',
        sprite: '../sprites/lemming-johny.png',
        start: {
            x: 6,
            y: 4
        },
        playground: playground
    });
    
    var actor4 = new Walker({
        elementID: 'actor4',
        cssClasses: 'human',
        sprite: '../sprites/lemming-johny.png',
        start: {
            x: 8,
            y: 4
        },
        playground: playground
    });*/
    
    /*$('#playground').click(function(e) {
        actor1.move(
            e.pageX - this.offsetLeft, 
            e.pageY - this.offsetTop
        );
    });*/

    /*var walkers = {};
    
    for (var i = 0; i < 60; i++) {
        walkers['walker' + i] = new Walker({
            elementID: 'walker' + i,
            cssClasses: 'human',
            sprite: '../sprites/lemming-johny.png',
            start: {
                x: Math.floor(Math.random()*16),
                y: Math.floor(Math.random()*16)
            },
            playground: playground
        });
    }
    
    setInterval(function () {
        for (var i = 0; i < 30; i++) {
            var index = Math.floor(Math.random()*60);
            walkers['walker' + index].move(
                Math.floor(Math.random()*512),
                Math.floor(Math.random()*512)
            );
        }
    }, 5000);*/
});