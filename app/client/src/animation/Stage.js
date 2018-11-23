import * as THREE from "three";
import {PointLight} from "./PointLight";



export class Stage {

    constructor() {
        throw new Error("Utility class, non instantiable");
    }

    static start() {
        const renderer = new THREE.WebGLRenderer();
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);

        // camera
        const VIEW_ANGLE = 45;
        const ASPECT = WIDTH / HEIGHT;
        const NEAR = 0.1;
        const FAR = 10000;
        const camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.set(0, 0, - 1000);

        // scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.add(camera);
        document.getElementById("animation").appendChild(renderer.domElement);

        // sphere
        const RADIUS = 200;
        const SEGMENTS = 50;
        const RINGS = 50;
        const globe = new THREE.Group();
        scene.add(globe);

        // point on the sphere
        let point;
        point = new THREE.Mesh(new THREE.SphereGeometry(.02 * RADIUS, SEGMENTS, RINGS), new THREE.MeshBasicMaterial({color: 0x888888}));
        point.position.y = RADIUS;
        globe.add(point);
        point = new THREE.Mesh(new THREE.SphereGeometry(.02 * RADIUS, SEGMENTS, RINGS), new THREE.MeshBasicMaterial({color: 0x888888}));
        point.position.y = - RADIUS;
        globe.add(point);
        point = new THREE.Mesh(new THREE.SphereGeometry(.02 * RADIUS, SEGMENTS, RINGS), new THREE.MeshBasicMaterial({color: 0x888888}));
        point.position.x = RADIUS;
        globe.add(point);

        const loader = new THREE.TextureLoader();

        // starfield
        let galaxyGeometry = new THREE.SphereGeometry(6000, 64, 64);
        let galaxyMaterial = new THREE.MeshBasicMaterial({side: THREE.BackSide});
        let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
        loader.load("textures/starfield.png", texture => {

            galaxyMaterial.map = texture;
            scene.add(galaxy);
        });

        loader.load("textures/earth.jpg", texture => {

            const sphere = new THREE.SphereGeometry(RADIUS, SEGMENTS, RINGS);
            const material = new THREE.MeshBasicMaterial({map: texture});
            const mesh = new THREE.Mesh(sphere, material);
            globe.add(mesh);
        });

        // controls
        const orbitControls = new THREE.OrbitControls(camera);
        orbitControls.update();

        // light
        const pointLight = new PointLight(0xFFFFFF);
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 400;
        scene.add(pointLight);

        let rotationVelocity = 100;

        let lastUpdate = Date.now();
        function render() {
            let currUpdate = Date.now();
            const delta = (currUpdate - lastUpdate) * 0.001;

            rotationVelocity += - .85 * rotationVelocity * delta;
            globe.rotation.y += rotationVelocity * delta;
            orbitControls.update();

            renderer.render(scene, camera);
            lastUpdate = currUpdate;
            requestAnimationFrame(render);
        }
        render();
    }
}
