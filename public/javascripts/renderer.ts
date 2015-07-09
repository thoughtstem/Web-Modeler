///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/threejs/three.d.ts" />
///<reference path="main.ts" />

/**
 * The UI and World renderer
 * Created by Henry on 6/28/2015.
 */
import $ = require("jquery");
import THREE = require("three");
declare var Math:any;

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
                            0,
                            selected,
                            selected.position.x,
                            function (self) {
                                selected.position.x = parseFloat($(self).val());
                                $(self).val(selected.position.x);
                            }
                        ))
                        .append($("<span>").html("Y "))
                        .append(this.createInput(
                            1,
                            selected,
                            selected.position.y,
                            function (self) {
                                selected.position.y = parseFloat($(self).val());
                                $(self).val(selected.position.y);
                            }
                        ))
                        .append($("<span>").html("Z "))
                        .append(this.createInput(
                            2,
                            selected,
                            selected.position.z,
                            function (self) {
                                selected.position.z = parseFloat($(self).val());
                                $(self).val(selected.position.z);
                            }
                        ))
                )
                    .append(
                    $("<p>")
                        .append($("<h4>").html("Rotation"))
                        .append($("<span>").html("X "))
                        .append(this.createInput(
                            3,
                            selected,
                            Math.degrees(selected.rotation.x),
                            function (self) {
                                selected.rotation.x = Math.radians(parseFloat($(self).val()));
                                $(self).val(Math.degrees(selected.rotation.x));
                            }
                        ))
                        .append($("<span>").html("Y "))
                        .append(this.createInput(
                            4,
                            selected,
                            Math.degrees(selected.rotation.y),
                            function (self) {
                                selected.rotation.y = Math.radians(parseFloat($(self).val()));
                                $(self).val(Math.degrees(selected.rotation.y));
                            }
                        ))
                        .append($("<span>").html("Z "))
                        .append(this.createInput(
                            5,
                            selected,
                            Math.degrees(selected.rotation.z),
                            function (self) {
                                selected.rotation.z = Math.radians(parseFloat($(self).val()));
                                $(self).val(Math.degrees(selected.rotation.z));
                            }
                        ))
                )
                    .append(
                    $("<p>")
                        .append($("<h4>").html("Scale"))
                        .append($("<span>").html("X "))
                        .append(this.createInput(
                            6,
                            selected,
                            selected.scale.x,
                            function (self) {
                                selected.scale.x = parseFloat($(self).val());
                                $(self).val(selected.scale.x);
                            }
                        ))
                        .append($("<span>").html("Y "))
                        .append(this.createInput(
                            7,
                            selected,
                            selected.scale.y,
                            function (self) {
                                selected.scale.y = parseFloat($(self).val());
                                $(self).val(selected.scale.y);
                            }
                        ))
                        .append($("<span>").html("Z "))
                        .append(this.createInput(
                            8,
                            selected,
                            selected.scale.z,
                            function (self) {
                                selected.scale.z = parseFloat($(self).val());
                                $(self).val(selected.scale.z);
                            }
                        ))
                )
            );
        }
    }

    typingTimer:{ [id: number] : any; } = {};

    //TODO: Add timer to wait for user to stop typing.
    private createInput(id:number, selected:THREE.Object3D, variable, callback) {
        return $('<input/>')
            .attr({type: "text", value: variable})
            .addClass("inputField")
            .keyup(function () {
                var self = this;

                if (this.typingTimer == undefined)
                    this.typingTimer = {};

                if (this.typingTimer[id] != null)
                    clearTimeout(this.typingTimer[id]);
                this.typingTimer[id] = setTimeout(function () {
                    callback(self)
                }, 500);
            })
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