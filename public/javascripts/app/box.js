/**
 * A box represents a rotatable cuboid
 * Created by Henry on 6/27/2015.
 */
define(
    ["lib/jquery", "lib/three"],
    function () {
        //TODO: Box should extend Entity
        var Box = function () {
            this.position = new THREE.Vector3(0, 0, 0);
            this.rotation = new THREE.Quaternion();
        };

        return Box;
    }
);