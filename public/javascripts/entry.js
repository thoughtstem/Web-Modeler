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
    new App();
});
