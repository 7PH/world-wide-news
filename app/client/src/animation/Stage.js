import * as THREE from "three";
import {lat2xyz} from "../util/maths";


export class Stage {

    constructor() {

        this.renderer = new THREE.WebGLRenderer();
        this.particleSystem = new THREE.GPUParticleSystem({
            maxParticles: 250000
        });
        this.particleOptions = {
            position: new THREE.Vector3(),
            positionRandomness: .3,
            velocity: new THREE.Vector3(),
            velocityRandomness: .1,
            color: 0xaa88ff,
            colorRandomness: .2,
            turbulence: .5,
            lifetime: 2,
            size: 5,
            sizeRandomness: 1
        };
        this.particleSpawnerOptions = {
            spawnRate: 15000,
            horizontalSpeed: 1.5,
            verticalSpeed: 1.33,
            timeScale: 1
        };

        this.scene = new THREE.Scene();

        this.galaxyGeometry = new THREE.SphereGeometry(6000, 64, 64);
        this.galaxyMaterial = new THREE.MeshBasicMaterial({side: THREE.BackSide});
        this.galaxy = new THREE.Mesh(this.galaxyGeometry, this.galaxyMaterial);

        this.globe = new THREE.Group();
        this.globeRotationVelocity = 10;
        this.globeRadius = 200;

        this.dotRadius = 0.002 * this.globeRadius;

        this.tick = 0;
        this.lastUpdate = Date.now();
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
        const material = new THREE.MeshBasicMaterial({color: 0x665588});
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
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        this.renderer.setSize(WIDTH, HEIGHT);

        // camera
        const VIEW_ANGLE = 45;
        const ASPECT = WIDTH / HEIGHT;
        const NEAR = 0.1;
        const FAR = 10000;
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera.position.set(0, 0, - 1000);

        // scene
        this.scene.background = new THREE.Color(0x000000);
        this.scene.add(this.camera);
        document.getElementById("animation").appendChild(this.renderer.domElement);

        // particles
        this.globe.add(this.particleSystem);

        // sphere
        const SEGMENTS = 50;
        const RINGS = 50;
        this.scene.add(this.globe);

        // dot group
        this.dots = new THREE.Group();
        this.globe.add(this.dots);

        // point on the sphere
        const loader = new THREE.TextureLoader();

        // starfield
        loader.load("textures/starfield.png", texture => {

            this.galaxyMaterial.map = texture;
            this.scene.add(this.galaxy);
        });

        loader.load("textures/earth.edited.jpg", texture => {

            const sphere = new THREE.SphereGeometry(this.globeRadius, SEGMENTS, RINGS);
            const material = new THREE.MeshBasicMaterial({
                map: texture
            });
            const mesh = new THREE.Mesh(sphere, material);
            this.globe.add(mesh);
        });

        // controls
        this.orbitControls = new THREE.OrbitControls(
            this.camera,
            document.getElementById("animation"));
        this.orbitControls.update();

        // light
        const pointLight =  new THREE.AmbientLight(0x404040);
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 400;
        this.scene.add(pointLight);

        this.render();
    }

    render() {
        let currUpdate = Date.now();
        const delta = (currUpdate - this.lastUpdate) * 0.001;
        this.tick += delta;

        this.globeRotationVelocity += - .85 * this.globeRotationVelocity * delta;
        this.globe.rotation.y += this.globeRotationVelocity * delta;
        this.galaxy.rotation.y += 0.004 * delta;

        for (let dot of this.dots.children) {
            this.particleOptions.position = dot.position;
            this.particleOptions.velocity.x = (Math.random() - .5) * 1.5;
            this.particleOptions.velocity.y = (Math.random() - .5) * 1.5;
            this.particleOptions.velocity.z = (Math.random() - .5) * 1.5;
            this.particleSystem.spawnParticle(this.particleOptions);
        }

        this.orbitControls.update();
        this.particleSystem.update(this.tick);

        this.renderer.render(this.scene, this.camera);
        this.lastUpdate = currUpdate;
        requestAnimationFrame(() => this.render());
    }
}
