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
    container:any;
    renderer = new THREE.WebGLRenderer({antialias: true});

    constructor(private app) {
        this.container = $("<div>").appendTo(document.body);

        /**
         * WebGL Renderer
         */
        this.renderer.setClearColor(0xf0f0f0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.append(this.renderer.domElement);
    }

    /**
     * Renders the user interface.
     */
    renderUI() {
        $("<div>")
            .addClass("ui")
            .addClass("header")
            .append(
            $("<h1>")
                .html("Voxel Modeler")
        )
            .appendTo(this.container);

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
                .click(this.app.onAdd)
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
            .appendTo(this.container);
    }

    /**
     * Renders the world.
     */
    renderWorld() {
        this.renderer.render(this.app.scene, this.app.camera);
    }
}

export = Renderer;