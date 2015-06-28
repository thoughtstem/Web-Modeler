/**
 * The main application file
 * Created by Henry on 6/27/2015.
 */
define([
        "lib/orbitcontrols",
        "lib/jquery",
        "lib/three"
    ],
    function (OrbitControls) {
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

            /**
             * An array of objects in the world.
             * @type {Array}
             */
            self.objects = [];

            /**
             * Called when the Main singleton is initialized.
             */
            self.init = function () {
                self.container = document.createElement('div');
                document.body.appendChild(self.container);

                /**
                 * Draw header information.
                 */
                var info = document.createElement('div');
                info.style.position = 'absolute';
                info.style.top = '10px';
                info.style.width = '100%';
                info.style.textAlign = 'center';
                info.innerHTML = 'Voxel Modeler<br><strong>click</strong>: add voxel, <strong>shift + click</strong>: remove voxel';
                self.container.appendChild(info);

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

                self.objects.push(self.plane);

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
                $(document).bind("keydown", self.onDocumentKeyDown);
                $(document).bind("keyup", self.onDocumentKeyUp);
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

                    var intersects = self.raycaster.intersectObjects(self.objects);

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

                    var intersects = self.raycaster.intersectObjects(self.objects);

                    if (intersects.length > 0) {
                        var intersect = intersects[0];

                        if (self.isShiftDown) {
                            // delete cube
                            if (intersect.object != self.plane) {
                                self.scene.remove(intersect.object);
                                self.objects.splice(self.objects.indexOf(intersect.object), 1);
                            }
                        } else {
                            // create cube
                            var voxel = new THREE.Mesh(self.cubeGeo, self.cubeMaterial);
                            voxel.position.copy(intersect.point).add(intersect.face.normal);
                            voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                            self.scene.add(voxel);

                            self.objects.push(voxel);

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

            self.onDocumentKeyDown = function (event) {
                switch (event.keyCode) {
                    case 16:
                        self.isShiftDown = true;
                        break;
                }
            };

            self.onDocumentKeyUp = function (event) {
                switch (event.keyCode) {
                    case 16:
                        self.isShiftDown = false;
                        break;
                }

            };

            self.render = function () {
                self.renderer.render(self.scene, self.camera);
            };
        };

        return Main;
    }
);