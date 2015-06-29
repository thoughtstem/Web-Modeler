//<reference path="typings/threejs/three.d.ts">
//<reference path="typings/threejs/detector.d.ts">

/**
 * The main JS entry point to run the application
 * Created by Henry on 6/27/2015.
 */
import Detector = require("./lib/detector");
import Main = require("./main");

if (!Detector.webgl) Detector.addGetWebGLMessage();
Main.init();