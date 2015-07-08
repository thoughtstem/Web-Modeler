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
                    .append($('<input/>').attr({type: "text", value: "Box"}).addClass("inputField"))
                    .append(
                    $("<p>")
                        .append($("<h4>").html("Position"))
                        .append($("<span>").html("X "))
                        .append(this.createInput(
                            selected,
                            selected.position.x,
                            function () {
                                selected.position.x = parseFloat($(this).val());
                                $(this).val(selected.position.x);
                            }
                        ))
                        .append($("<span>").html("Y "))
                        .append(this.createInput(
                            selected,
                            selected.position.y,
                            function () {
                                selected.position.y = parseFloat($(this).val());
                                $(this).val(selected.position.y);
                            }
                        ))
                        .append($("<span>").html("Z "))
                        .append(this.createInput(
                            selected,
                            selected.position.z,
                            function () {
                                selected.position.z = parseFloat($(this).val());
                                $(this).val(selected.position.z);
                            }
                        ))
                )
                    .append(
                    $("<p>")
                        .append($("<h4>").html("Rotation"))
                        .append($("<span>").html("X "))
                        .append(this.createInput(
                            selected,
                            selected.rotation.x,
                            function () {
                                selected.rotation.x = parseFloat($(this).val());
                                $(this).val(selected.rotation.x);
                            }
                        ))
                        .append($("<span>").html("Y "))
                        .append(this.createInput(
                            selected,
                            selected.rotation.y,
                            function () {
                                selected.rotation.y = parseFloat($(this).val());
                                $(this).val(selected.rotation.y);
                            }
                        ))
                        .append($("<span>").html("Z "))
                        .append(this.createInput(
                            selected,
                            selected.rotation.z,
                            function () {
                                selected.rotation.z = parseFloat($(this).val());
                                $(this).val(selected.rotation.z);
                            }
                        ))
                )
                    .append(
                    $("<p>")
                        .append($("<h4>").html("Scale"))
                        .append($("<span>").html("X "))
                        .append(this.createInput(
                            selected,
                            selected.scale.x,
                            function () {
                                selected.scale.x = parseFloat($(this).val());
                                $(this).val(selected.scale.x);
                            }
                        ))
                        .append($("<span>").html("Y "))
                        .append(this.createInput(
                            selected,
                            selected.scale.y,
                            function () {
                                selected.scale.y = parseFloat($(this).val());
                                $(this).val(selected.scale.y);
                            }
                        ))
                        .append($("<span>").html("Z "))
                        .append(this.createInput(
                            selected,
                            selected.scale.z,
                            function () {
                                selected.scale.z = parseFloat($(this).val());
                                $(this).val(selected.scale.z);
                            }
                        ))
                )
            );
        }
    }

    private timer = null;
    //TODO: Add timer to wait for user to stop typing.
    private createInput(selected:THREE.Object3D, variable, callback) {
        return $('<input/>')
            .attr({type: "text", value: variable})
            .addClass("inputField")
            .keyup(callback)
            .keyup(() => this.renderWorld());
    }

    /**
     * Renders the world.
     */
    renderWorld() {
        this.renderer.render(this.app.scene, this.app.camera);
    }
}

export = Renderer;