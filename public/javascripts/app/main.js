/**
 * The main application file
 * Created by Henry on 6/27/2015.
 */
define([
        "app/world",
        "app/input",
        "lib/underscore",
        "lib/orbitcontrols",
        "lib/jquery",
        "lib/three"
    ],
    function (World, Input) {
        /**
         * Main is a singleton class.
         * @constructor
         */
        var Main = new function () {

            /**
             * The self instance
             * @type {Main}
             */
            var self = this;

            self.keyMap = {
                SHIFT: 16
            }

            /**
             * Called when the Main singleton is initialized.
             */
            self.init = function () {
                self.container = document.createElement('div');
                document.body.appendChild(self.container);

                /**
                 * Draw user interface.
                 */
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

                /**
                 * Create Camera
                 * @type {THREE.PerspectiveCamera}
                 */
                self.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
                self.camera.position.set(500, 800, 1300);
                self.camera.lookAt(new THREE.Vector3());


                self.scene = new THREE.Scene();

                // roll-over helpers
                var rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
                self.rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
                self.rollOverMesh = new THREE.Mesh(rollOverGeo, self.rollOverMaterial);
                self.scene.add(self.rollOverMesh);

                // cubes
                self.cubeGeo = new THREE.BoxGeometry(50, 50, 50);
                self.cubeMaterial = new THREE.MeshLambertMaterial({color: 0xfeb74c, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture("textures/square-outline-textured.png")});

                // grid
                var size = 500, step = 50;

                var Geometry = new THREE.Geometry();

                for (var i = -size; i <= size; i += step) {

                    Geometry.vertices.push(new THREE.Vector3(-size, 0, i));
                    Geometry.vertices.push(new THREE.Vector3(size, 0, i));

                    Geometry.vertices.push(new THREE.Vector3(i, 0, -size));
                    Geometry.vertices.push(new THREE.Vector3(i, 0, size));

                }

                var material = new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2, transparent: true});

                var line = new THREE.Line(Geometry, material, THREE.LinePieces);
                self.scene.add(line);

                self.raycaster = new THREE.Raycaster();
                self.mouse = new THREE.Vector2();

                var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
                geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

                self.plane = new THREE.Mesh(geometry);
                self.plane.visible = false;
                self.scene.add(self.plane);

                World.objects.push(self.plane);

                // Lights
                var ambientLight = new THREE.AmbientLight(0x606060);
                self.scene.add(ambientLight);

                var directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(1, 0.75, 0.5).normalize();
                self.scene.add(directionalLight);

                //Renderer
                self.renderer = new THREE.WebGLRenderer({antialias: true});
                self.renderer.setClearColor(0xf0f0f0);
                self.renderer.setPixelRatio(window.devicePixelRatio);
                self.renderer.setSize(window.innerWidth, window.innerHeight);
                self.container.appendChild(self.renderer.domElement);

                //Controls
                self.controls = new THREE.OrbitControls(self.camera, self.renderer.domElement);

                $(document).bind("mousemove", self.onDocumentMouseMove);
                $(document).bind("mousedown", self.onMouseDown);
                $(document).bind("mouseup", self.onMouseUp);
                $(window).bind("resize", self.onWindowResize);
                self.render();
            };

            self.onWindowResize = function () {
                self.camera.aspect = window.innerWidth / window.innerHeight;
                self.camera.updateProjectionMatrix();

                self.renderer.setSize(window.innerWidth, window.innerHeight);
            };

            self.onDocumentMouseMove = function (event) {
                event.preventDefault();

                self.mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

                if (!self.isMiddleMouseDown) {
                    self.camera.lookAt(new THREE.Vector3());
                    self.raycaster.setFromCamera(self.mouse, self.camera);

                    var intersects = self.raycaster.intersectObjects(World.objects);

                    if (intersects.length > 0) {
                        var intersect = intersects[0];
                        self.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
                        self.rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    }
                }

                self.render();
            };

            self.onMouseDown = function (event) {
                event.preventDefault();

                self.mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

                if (event.which == 2) {
                    self.isMiddleMouseDown = true;
                }
                else {
                    self.raycaster.setFromCamera(self.mouse, self.camera);
                    var intersects = self.raycaster.intersectObjects(World.objects);

                    if (intersects.length > 0) {
                        var intersect = intersects[0];

                        if (_.contains(Input.pressed, self.keyMap.SHIFT)) {
                            // delete cube
                            if (intersect.object != self.plane) {
                                self.scene.remove(intersect.object);
                                World.objects.splice(World.objects.indexOf(intersect.object), 1);
                            }
                        } else {
                            // create cube
                            var voxel = new THREE.Mesh(self.cubeGeo, self.cubeMaterial);
                            voxel.position.copy(intersect.point).add(intersect.face.normal);
                            voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                            self.scene.add(voxel);

                            World.objects.push(voxel);

                        }

                        self.render();
                    }
                }
            };

            self.onMouseUp = function (e) {
                if (e.which == 2) {
                    self.isMiddleMouseDown = false;
                }
            };

            self.render = function () {
                self.renderer.render(self.scene, self.camera);
            };
        };

        return Main;
    }
);