/**
 * The main JS entry point to run the application
 * Created by Henry on 6/27/2015.
 */
requirejs(
    [
        "lib/detector",
        "app/main",
        "lib/jquery"
    ],
    function (Detector, Main) {
        if (!Detector.webgl) Detector.addGetWebGLMessage();
        Main.init();
        $.noConflict(true);
    }
);