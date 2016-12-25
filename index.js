require('aframe');

var physics = require('aframe-physics-system');
physics.registerAll();

var Leap = require('leapjs');

var handedness = 'right';
var controller = new Leap.Controller();
controller.connect();

controller.on('frame', function (frame) {
    if (frame.hands.length > 0) {
        for (var i = 0; i < frame.hands.length; i++) {
            var hand = frame.hands[i];

            if (hand.type === handedness) {
                swing(hand);
            } else {
                serve(hand);
            }
        }
    }
});

var swing = function (hand) {
    var racket = document.getElementById('racket');
    if (racket) {
        var position = new AFRAME.THREE.Vector3();
        position.x = hand.palmPosition[0];
        position.y = hand.palmPosition[1];
        position.z = hand.palmPosition[2];

        var rotation = new AFRAME.THREE.Vector3();
        rotation.x = 90 - Math.atan(hand.palmNormal[1] / hand.palmNormal[2]) * 180 / Math.PI;
        rotation.y = 0;
        rotation.z = 90 - Math.acos(hand.palmNormal[0]) * 180 / Math.PI;

        racket.setAttribute('position', position);
        racket.setAttribute('rotation', rotation);
    }
};

var isServe = true;

var serve = function (hand) {
    if (isServe) {
        var position = new AFRAME.THREE.Vector3();
        position.x = hand.palmPosition[0];
        position.y = hand.palmPosition[1];
        position.z = hand.palmPosition[2];

        var dummy = document.getElementById('dummy_ball');

        if (dummy && hand.palmVelocity[1] >= 200) {
            var velocity = new AFRAME.THREE.Vector3();
            //velocity.x = hand.palmVelocity[0] * 0.5;
            velocity.y = hand.palmVelocity[1] * 0.5;
            //velocity.z = hand.palmVelocity[2] * 0.5;

            serveBall(position, velocity);

            isServe = false;
            dummy.setAttribute('visible', false);
            dummy.setAttribute('isPlaying', false);

        } else {
            dummy.setAttribute('position', position);
        }
    }
};

var serveBall = function (position, velocity) {
    var scene = document.querySelector('a-scene');
    var ball = document.createElement('a-entity');
    ball.setAttribute('id', "ball");
    ball.setAttribute('position', position);
    ball.setAttribute('velocity', velocity);
    ball.setAttribute('geometry', "primitive: sphere; radius: 2;");
    ball.setAttribute('dynamic-body', "math: 0.27;");
    ball.setAttribute('material', "color: #ffa500;");
    scene.appendChild(ball);
};