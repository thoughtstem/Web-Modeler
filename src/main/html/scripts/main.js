/**
 * The main JS file to run the application
 * Created by Henry on 6/27/2015.
 */
requirejs(
    [
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r71/three.min.js",
        "lib/detector"
    ],
    function ($, _, three, detector) {
        if (!detector.webgl) detector.addGetWebGLMessage();

        var container;
        var camera, scene, renderer;
        var plane, cube;
        var mouse, raycaster, isShiftDown = false;

        var rollOverMesh, rollOverMaterial;
        var cubeGeo, cubeMaterial;

        var objects = [];

        init();
        render();

        function init() {
            container = document.createElement('div');
            document.body.appendChild(container);

            var info = document.createElement('div');
            info.style.position = 'absolute';
            info.style.top = '10px';
            info.style.width = '100%';
            info.style.textAlign = 'center';
            info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> - voxel painter - webgl<br><strong>click</strong>: add voxel, <strong>shift + click</strong>: remove voxel';
            container.appendChild(info);

            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.set(500, 800, 1300);
            camera.lookAt(new THREE.Vector3());

            scene = new THREE.Scene();

            // roll-over helpers

            rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
            rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
            rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
            scene.add(rollOverMesh);

            // cubes

            cubeGeo = new THREE.BoxGeometry(50, 50, 50);
            cubeMaterial = new THREE.MeshLambertMaterial({color: 0xfeb74c, shading: THREE.FlatShading, map: THREE.ImageUtils.loadTexture("textures/square-outline-textured.png")});

            // grid

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
            scene.add(line);

            //

            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
            geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

            plane = new THREE.Mesh(geometry);
            plane.visible = false;
            scene.add(plane);

            objects.push(plane);

            // Lights

            var ambientLight = new THREE.AmbientLight(0x606060);
            scene.add(ambientLight);

            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 0.75, 0.5).normalize();
            scene.add(directionalLight);

            renderer = new THREE.WebGLRenderer({antialias: true});
            renderer.setClearColor(0xf0f0f0);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);

            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('mousedown', onDocumentMouseDown, false);
            document.addEventListener('keydown', onDocumentKeyDown, false);
            document.addEventListener('keyup', onDocumentKeyUp, false);

            //

            window.addEventListener('resize', onWindowResize, false);

        }

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        }

        function onDocumentMouseMove(event) {

            event.preventDefault();

            mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(objects);

            if (intersects.length > 0) {

                var intersect = intersects[0];

                rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
                rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

            }

            render();

        }

        function onDocumentMouseDown(event) {
            event.preventDefault();

            mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);

            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(objects);

            if (intersects.length > 0) {

                var intersect = intersects[0];

                // delete cube

                if (isShiftDown) {

                    if (intersect.object != plane) {

                        scene.remove(intersect.object);

                        objects.splice(objects.indexOf(intersect.object), 1);

                    }

                    // create cube

                } else {

                    var voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
                    voxel.position.copy(intersect.point).add(intersect.face.normal);
                    voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                    scene.add(voxel);

                    objects.push(voxel);

                }

                render();
            }
        }

        function onDocumentKeyDown(event) {
            switch (event.keyCode) {
                case 16:
                    isShiftDown = true;
                    break;
            }
        }

        function onDocumentKeyUp(event) {
            switch (event.keyCode) {
                case 16:
                    isShiftDown = false;
                    break;
            }

        }

        function render() {
            renderer.render(scene, camera);
        }
    }
);