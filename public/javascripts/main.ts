///<reference path="typings/jquery/jquery.d.ts" />
///<reference path="typings/underscore/underscore.d.ts" />
///<reference path="typings/threejs/three.d.ts" />
///<reference path="typings/threejs/three-orbitcontrols.d.ts" />
///<reference path="typings/general.d.ts"/>
///<amd-dependency path="./lib/orbitcontrols" />

import $ = require("jquery");
import _ = require("underscore");
import THREE = require("three");
import World = require("./world");
import Input = require("./input");
import Renderer = require("./renderer");
import Box = require("./box");

/**
 * The Application singleton object.
 * Created by Henry on 6/27/2015.
 */
class App {
    camera:THREE.PerspectiveCamera;
    scene = new THREE.Scene();
    rollOverMesh:THREE.Mesh;
    rollOverMaterial:THREE.MeshBasicMaterial;
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    plane:THREE.Mesh;
    controls:THREE.OrbitControls;
    isMiddleMouseDown:boolean;

    /**
     * Initiate managers
     * @type {{SHIFT: number}}
     */
    renderer = new Renderer(this);
    world = new World(this);
    input = new Input(this, this.world);

    keyMap = {
        SHIFT: 16
    };

    /**
     * Called when the Main singleton is initialized.
     */
    init() {
        /**
         * Create Camera
         * @type {THREE.PerspectiveCamera}
         */
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(500, 800, 1300);
        this.camera.lookAt(new THREE.Vector3());

        // roll-over helpers
        var rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
        this.rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, this.rollOverMaterial);
        this.scene.add(this.rollOverMesh);

        // Draw grid
        var size = 500, step = 50;

        var geometry = new THREE.Geometry();

        for (var i = -size; i <= size; i += step) {
            geometry.vertices.push(new THREE.Vector3(-size, 0, i));
            geometry.vertices.push(new THREE.Vector3(size, 0, i));

            geometry.vertices.push(new THREE.Vector3(i, 0, -size));
            geometry.vertices.push(new THREE.Vector3(i, 0, size));
        }

        var material = new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2, transparent: true});

        var line = new THREE.Line(geometry, material, THREE.LinePieces);
        this.scene.add(line);

        var planeGeometry = new THREE.PlaneBufferGeometry(1000, 1000);
        planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

        this.plane = new THREE.Mesh(planeGeometry);
        this.plane.visible = false;
        this.scene.add(this.plane);

        this.world.objects.push(this.plane);

        // Lights
        var ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);

        //Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.renderer.domElement);

        $(document).bind("mousemove", this.onMouseMove);
        $(document).bind("mousedown", this.onMouseDown);
        $(document).bind("mouseup", this.onMouseUp);
        $(window).bind("resize", this.onWindowResize);

        this.renderer.renderUI();
        this.renderer.renderWorld();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        event.preventDefault();

        this.mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

        if (!this.isMiddleMouseDown) {
            this.camera.lookAt(new THREE.Vector3());
            this.raycaster.setFromCamera(this.mouse, this.camera);

            var intersects = this.raycaster.intersectObjects(this.world.objects);

            if (intersects.length > 0) {
                var intersect = intersects[0];
                this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
                this.rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
            }
        }

        this.renderer.renderWorld();
    }

    onMouseDown(event) {
        event.preventDefault();

        this.mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

        if (event.which == 2) {
            this.isMiddleMouseDown = true;
        }
        else {
            /*
            this.raycaster.setFromCamera(this.mouse, this.camera);
            var intersects = this.raycaster.intersectObjects(World.objects);

            if (intersects.length > 0) {
                var intersect = intersects[0];

             if (_.contains(this.input.pressed, this.keyMap.SHIFT)) {
                    // delete cube
                    if (intersect.object != this.plane) {
                        this.scene.remove(intersect.object);
                        World.objects.splice(World.objects.indexOf(intersect.object), 1);
                    }
                } else {

                    // create cube
                    var voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);
                    voxel.position.copy(intersect.point).add(intersect.face.normal);
                    voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    this.scene.add(voxel);

                    World.objects.push(voxel);
                }

             this.renderer.renderWorld();
             }*/
        }
    }

    onMouseUp(e) {
        if (e.which == 2) {
            this.isMiddleMouseDown = false;
        }
    }

    /**
     * Called when the add button is clicked.
     */
    onAdd() {
        var box = new Box();
        box.position = new THREE.Vector3();
        this.world.add(box)
    }
}

export = App;