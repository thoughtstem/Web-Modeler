/**
 * The Main singleton object.
 * Created by Henry on 6/27/2015.
 */
define(
    [
        "app/world",
        "app/input",
        "app/renderer",
        "lib/underscore",
        "lib/jquery",
        "lib/orbitcontrols",
        "lib/three"
    ],
    function (World, Input, Renderer) {
        return new function () {

            /**
             * The self instance
             * @type {Main}
             */
            var self = this;

            self.keyMap = {
                SHIFT: 16
            };

            self.scene = new THREE.Scene();

            /**
             * Called when the Main singleton is initialized.
             */
            self.init = function () {
                console.log("init " + self.scene);
                /**
                 * Create Camera
                 * @type {THREE.PerspectiveCamera}
                 */
                self.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
                self.camera.position.set(500, 800, 1300);
                self.camera.lookAt(new THREE.Vector3());


                // roll-over helpers
                var rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
                self.rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
                self.rollOverMesh = new THREE.Mesh(rollOverGeo, self.rollOverMaterial);
                self.scene.add(self.rollOverMesh);

                // cubes
                self.cubeGeo = new THREE.BoxGeometry(50, 50, 50);
                self.cubeMaterial = new THREE.MeshLambertMaterial({color: 0xfeb74c, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture("textures/square-outline-textured.png")});

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
                self.scene.add(line);

                self.raycaster = new THREE.Raycaster();
                self.mouse = new THREE.Vector2();

                var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
                geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

                self.plane = new THREE.Mesh(geometry);
                self.plane.visible = false;
                self.scene.add(self.plane);

                World.entities.push(self.plane);

                // Lights
                var ambientLight = new THREE.AmbientLight(0x606060);
                self.scene.add(ambientLight);

                var directionalLight = new THREE.DirectionalLight(0xffffff);
                directionalLight.position.set(1, 0.75, 0.5).normalize();
                self.scene.add(directionalLight);

                //Controls
                self.controls = new THREE.OrbitControls(self.camera, Renderer.renderer.domElement);

                $(document).bind("mousemove", self.onDocumentMouseMove);
                $(document).bind("mousedown", self.onMouseDown);
                $(document).bind("mouseup", self.onMouseUp);
                $(window).bind("resize", self.onWindowResize);
                Renderer.renderWorld(World);
            };

            self.onWindowResize = function () {
                self.camera.aspect = window.innerWidth / window.innerHeight;
                self.camera.updateProjectionMatrix();

                Renderer.renderer.setSize(window.innerWidth, window.innerHeight);
            };

            self.onDocumentMouseMove = function (event) {
                event.preventDefault();

                self.mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

                if (!self.isMiddleMouseDown) {
                    self.camera.lookAt(new THREE.Vector3());
                    self.raycaster.setFromCamera(self.mouse, self.camera);

                    var intersects = self.raycaster.intersectObjects(World.entities);

                    if (intersects.length > 0) {
                        var intersect = intersects[0];
                        self.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
                        self.rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    }
                }

                Renderer.renderWorld();
            };

            self.onMouseDown = function (event) {
                event.preventDefault();

                self.mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

                if (event.which == 2) {
                    self.isMiddleMouseDown = true;
                }
                else {
                    self.raycaster.setFromCamera(self.mouse, self.camera);
                    var intersects = self.raycaster.intersectObjects(World.entities);

                    if (intersects.length > 0) {
                        var intersect = intersects[0];

                        if (_.contains(Input.pressed, self.keyMap.SHIFT)) {
                            // delete cube
                            if (intersect.object != self.plane) {
                                self.scene.remove(intersect.object);
                                World.entities.splice(World.entities.indexOf(intersect.object), 1);
                            }
                        } else {
                            // create cube
                            var voxel = new THREE.Mesh(self.cubeGeo, self.cubeMaterial);
                            voxel.position.copy(intersect.point).add(intersect.face.normal);
                            voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                            self.scene.add(voxel);

                            World.entities.push(voxel);

                        }

                        Renderer.renderWorld();
                    }
                }
            };

            self.onMouseUp = function (e) {
                if (e.which == 2) {
                    self.isMiddleMouseDown = false;
                }
            };
        };
    }
);