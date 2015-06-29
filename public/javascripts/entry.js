//<reference path="typings/threejs/three.d.ts">
//<reference path="typings/threejs/detector.d.ts">
define(["require", "exports", "./lib/detector", "./main"], function (require, exports, Detector, Main) {
    if (!Detector.webgl)
        Detector.addGetWebGLMessage();
    Main.init();
});
