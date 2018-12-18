import * as THREE from "three";
import {lat2xyz} from "../util/maths";
import {LAUSANNE, PHILLY} from "../util/coords";
import {APIHelper} from "../api/APIHelper";


export class Stage {

    constructor() {

        this.globeRadius = 200;
        this.dotRadius = 0.008 * this.globeRadius;
    }

    /**
     *
     * @param {{lat: number, long: number}[]} points
     * @return {Promise<void>}
     */
    async addDots(points) {

        // empty dots
        for (let i = this.dots.children.length - 1; i >= 0; --i)
            this.dots.remove(this.dots.children[i]);

        // prepare
        const pointGeometry = new THREE.SphereGeometry(this.dotRadius, 32, 32);
        const material = new THREE.MeshBasicMaterial({color: 0xffff00});
        const dot = new THREE.Mesh(pointGeometry.clone(), material.clone());

        // retrieve dots again
        try {
            for (let event of points) {
                let instance = dot.clone();
                const coords = lat2xyz(event.lat, event.long);
                instance.position.x = coords.x * this.globeRadius + 1.5 * this.dotRadius;
                instance.position.y = coords.y * this.globeRadius + 1.5 * this.dotRadius;
                instance.position.z = coords.z * this.globeRadius + 1.5 * this.dotRadius;
                this.dots.add(instance);
            }
        } catch (e) { console.error(e); }
    }

    async start() {
        const renderer = new THREE.WebGLRenderer();
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);

        // camera
        const VIEW_ANGLE = 45;
        const ASPECT = WIDTH / HEIGHT;
        const NEAR = 0.1;
        const FAR = 10000;
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera.position.set(0, 0, - 1000);

        // scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.add(this.camera);
        document.getElementById("animation").appendChild(renderer.domElement);

        // sphere
        const SEGMENTS = 50;
        const RINGS = 50;
        const globe = new THREE.Group();
        this.globe = globe;
        scene.add(globe);

        // dot group
        this.dots = new THREE.Group();
        globe.add(this.dots);

        // point on the sphere
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

            const sphere = new THREE.SphereGeometry(this.globeRadius, SEGMENTS, RINGS);
            const material = new THREE.MeshBasicMaterial({map: texture});
            const mesh = new THREE.Mesh(sphere, material);
            globe.add(mesh);
        });

        // controls
        const orbitControls = new THREE.OrbitControls(this.camera, document.getElementById("animation"));
        orbitControls.update();

        // light
        const pointLight =  new THREE.AmbientLight(0x404040);
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 400;
        scene.add(pointLight);

        let rotationVelocity = 10;

        let lastUpdate = Date.now();
        const render = () => {
            let currUpdate = Date.now();
            const delta = (currUpdate - lastUpdate) * 0.001;

            rotationVelocity += - .85 * rotationVelocity * delta;
            globe.rotation.y += rotationVelocity * delta;
            galaxy.rotation.y += 0.004 * delta;
            orbitControls.update();

            renderer.render(scene, this.camera);
            lastUpdate = currUpdate;
            requestAnimationFrame(() => render());
        };

        render();
    }
}
