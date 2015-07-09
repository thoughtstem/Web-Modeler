///<reference path="typings/threejs/three.d.ts"/>
///<reference path="typings/threejs/detector.d.ts"/>
///<reference path="typings/general.d.ts"/>
define(["require", "exports", "detector", "./main"], function (require, exports, Detector, App) {
    //Check WebGL
    if (!Detector.webgl)
        Detector.addGetWebGLMessage();
    //Check PointerLock
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if (!havePointerLock) {
        alert("Your browser must support pointer lock. Please try using Chrome or Firefox.");
    }
    // Converts from degrees to radians.
    Math.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };
    // Converts from radians to degrees.
    Math.degrees = function (radians) {
        return radians * 180 / Math.PI;
    };
    new App();
});
