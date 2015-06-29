/**
 * The UI and World renderer
 * Created by Henry on 6/28/2015.
 */
define(
    [
        "lib/three"
    ],
    function () {
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
                var Main = require("app/main");
                self.renderer.render(Main.scene, Main.camera);
            };
        };

        Renderer.renderUI();

        return Renderer;
    }
);