$(document).ready(function() {
    var playground = new DG.Playground({
        elementID: 'playground'
    });
    
    var actor1 = new DG.Actor({
        id: 'actor1',
        cssClasses: 'human',
        sprite: 'assets/sprites/actor-joe.png',
        start: {
            x: 2,
            y: 2
        },
        playground: playground
    });
    
    var actor2 = new DG.Actor({
        id: 'actor2',
        cssClasses: 'human',
        sprite: 'assets/sprites/actor-johny.png',
        start: {
            x: 4,
            y: 4
        },
        playground: playground
    });
    
    playground.onMouseNavigation(function(left, top) {
        actor1.move(left, top);
    });

    playground.onKeyboardNavigation(function (direction) {
        actor2.step(direction);
    });
    
    playground.onMouseMove(function (left, top) {
        actor1.rotate(left, top);
        actor2.rotate(left, top);
    });
});