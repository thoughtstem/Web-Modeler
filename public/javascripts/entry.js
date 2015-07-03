///<reference path="typings/threejs/three.d.ts"/>
///<reference path="typings/threejs/detector.d.ts"/>
///<reference path="typings/general.d.ts"/>
define(["require", "exports", "detector", "./main"], function (require, exports, Detector, App) {
    if (!Detector.webgl)
        Detector.addGetWebGLMessage();
    new App().init();
});
