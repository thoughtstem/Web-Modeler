/**
 * The main JS entry point to run the application
 * Created by Henry on 6/27/2015.
 */
var Detector = require("./lib/detector.js");
var Main = require("./main.js");

if (!Detector.webgl) Detector.addGetWebGLMessage();
Main.init();