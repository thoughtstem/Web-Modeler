///<reference path="typings/threejs/three.d.ts"/>
///<reference path="typings/threejs/detector.d.ts"/>
///<reference path="typings/general.d.ts"/>

/**
 * The main JS entry point to run the application
 * Created by Henry on 6/27/2015.
 */
import Detector = require("detector");
import App = require("./main");

//Check WebGL
if (!Detector.webgl) Detector.addGetWebGLMessage();

//Check PointerLock
var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

if (!havePointerLock) {
    alert("Your browser must support pointer lock. Please try using Chrome or Firefox.");
}

new App();
