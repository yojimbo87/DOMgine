$(document).ready(function() {

    var playground = new DG.Playground({
        elementID: 'playground'
    });
    
    var actor1 = new DG.Actor({
        elementID: 'actor1',
        cssClasses: 'human',
        sprite: '../assets/sprites/actor-joe.png',
        start: {
            x: 2,
            y: 2
        },
        playground: playground
    });
    
    var actor2 = new DG.Actor({
        elementID: 'actor2',
        cssClasses: 'human',
        sprite: '../assets/sprites/actor-johny.png',
        start: {
            x: 4,
            y: 4
        },
        playground: playground
    });
    
    playground.onMouseNavigation(function (left, top) {
        actor1.move(left, top);
    });

    playground.onKeyboardNavigation(function (direction) {
        actor2.step(direction);
    });
    
    playground.onMouseMove(function (left, top) {
        actor1.rotate(left, top);
        actor2.rotate(left, top);
    });
    
    /*var actor3 = new DG.Actor({
        elementID: 'actor3',
        cssClasses: 'human',
        sprite: '../assets/sprites/actor-johny.png',
        start: {
            x: 6,
            y: 4
        },
        playground: playground
    });
    
    var actor4 = new DG.Actor({
        elementID: 'actor4',
        cssClasses: 'human',
        sprite: '../assets/sprites/actor-johny.png',
        start: {
            x: 8,
            y: 4
        },
        playground: playground
    });*/

    /*var actors = {};
    
    for (var i = 0; i < 60; i++) {
        actors['actor' + i] = new DG.Actor({
            elementID: 'actor' + i,
            cssClasses: 'human',
            sprite: '../assets/sprites/actor-johny.png',
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
            actors['actor' + index].move(
                Math.floor(Math.random()*512),
                Math.floor(Math.random()*512)
            );
        }
    }, 5000);*/
});