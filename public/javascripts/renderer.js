/**
 * The UI and World renderer
 * Created by Henry on 6/28/2015.
 */
var $ = require("./lib/jquery.js");
var THREE = require("./lib/three.js");

var Renderer = new function () {
    var self = this;

    self.container = $("<div>").appendTo(document.body);

    /**
     * WebGL Renderer
     */
    self.renderer = new THREE.WebGLRenderer({antialias: true});
    self.renderer.setClearColor(0xf0f0f0);
    self.renderer.setPixelRatio(window.devicePixelRatio);
    self.renderer.setSize(window.innerWidth, window.innerHeight);
    self.container.append(self.renderer.domElement);

    /**
     * Renders the user interface.
     */
    self.renderUI = function () {
        var Main = require("./main.js");
        $("<div>")
            .addClass("ui")
            .addClass("header")
            .append(
            $("<h1>")
                .html("Voxel Modeler")
        )
            .appendTo(self.container);

        $("<div>")
            .addClass("ui")
            .addClass("panel")
            .append(
            $("<div>")
                .append($("<h4>").html("Input Control"))
                .append($("<p>").html("Middle - Rotate"))
        )
            .append(
            $("<button>")
                .attr("type", "button")
                .addClass("btn")
                .addClass("btn-default")
                .append(
                $("<span>")
                    .addClass("glyphicon")
                    .addClass("glyphicon-plus")
            )
                .click(Main.onAdd)
        ).append(
            $("<button>")
                .attr("type", "button")
                .addClass("btn")
                .addClass("btn-default")
                .append(
                $("<span>")
                    .addClass("glyphicon")
                    .addClass("glyphicon-pencil")
            )
        )
            .appendTo(self.container);
    };

    /**
     * Renders the world.
     */
    self.renderWorld = function () {
        var Main = require("./main.js");
        self.renderer.render(Main.scene, Main.camera);
    };
};

module.exports = Renderer;