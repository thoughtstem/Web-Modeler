///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/threejs/three.d.ts" />
///<reference path="main.ts" />

/**
 * The UI and World renderer
 * Created by Henry on 6/28/2015.
 */
import $ = require("jquery");
import THREE = require("three");

class Renderer {
    /**
     * The primary container that contains the program.
     */
    container:any;
    renderer = new THREE.WebGLRenderer({antialias: true});
    heading = $("<div>");
    panel = $("<div>");

    constructor(private app) {
        this.container = $("<div>").appendTo(document.body);

        /**
         * WebGL Renderer
         */
        this.renderer.setClearColor(0xf0f0f0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.append(this.renderer.domElement);

        this.heading
            .addClass("ui")
            .addClass("header")
            .appendTo(this.container);

        this.panel
            .addClass("ui")
            .addClass("panel")
            .appendTo(this.container);
    }

    /**
     * Renders the user interface.
     */
    renderUI() {
        this.heading.empty();
        this.heading
            .append(
            $("<h1>")
                .html("Voxel Modeler")
        );

        this.panel.empty();
        this.panel.append(
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
                .click((evt) => this.app.onAdd())
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
        );

        var selected = this.app.input.selected;
        if (selected != null) {
            var euler = new THREE.Euler().setFromQuaternion(selected.quaternion, "YZX");
            this.panel.append(
                $("<div>")
                    .append($("<h3>").html("Box"))
                    .append(
                    $("<p>")
                        .append($("<h4>").html("Position"))
                        .append($("<span>").html("X " + selected.position.x + " Y " + selected.position.y + " Z " + selected.position.z))
                )
                    .append(
                    $("<p>")
                        .append($("<h4>").html("Rotation"))
                        .append($("<span>").html("Yaw: " + euler.x + " Pitch: " + euler.y + " Roll: " + euler.z))
                )
                    .append(
                    $("<p>")
                        .append($("<h4>").html("Scale"))
                        .append($("<span>").html("X " + selected.scale.x + " Y " + selected.scale.y + " Z " + selected.scale.z))
                )
            );
        }
    }

    /**
     * Renders the world.
     */
    renderWorld() {
        this.renderer.render(this.app.scene, this.app.camera);
    }
}

export = Renderer;