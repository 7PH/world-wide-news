import * as THREE from "three";
import {lat2xyz} from "../util/maths";


export class Stage {

    constructor() {

        this.events = [];

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.particleSystem = new THREE.GPUParticleSystem({maxParticles: 250000});
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

        const VIEW_ANGLE = 45;
        const ASPECT = window.innerWidth / window.innerHeight;
        const NEAR = 0.1;
        const FAR = 10000;
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

        this.scene = new THREE.Scene();

        this.galaxyGeometry = new THREE.SphereGeometry(6000, 64, 64);
        this.galaxyMaterial = new THREE.MeshBasicMaterial({side: THREE.BackSide});
        this.galaxy = new THREE.Mesh(this.galaxyGeometry, this.galaxyMaterial);

        this.globe = new THREE.Group();
        this.globeRotationVelocity = 8;
        this.globeRadius = 200;

        this.dots = new THREE.Group();
    }

    /**
     *
     * @param {{lat: number, long: number}[]} events
     * @return {Promise<void>}
     */
    async setEvents(events) {

        this.events = events.map(event => {
            event.position = lat2xyz(event.lat, event.long);
            event.position.x = (event.position.x + .01) * this.globeRadius;
            event.position.y = (event.position.y + .01) * this.globeRadius;
            event.position.z = (event.position.z + .01) * this.globeRadius;
            return event;
        });
    }

    async start() {

        this.tick = 0;
        this.lastUpdate = Date.now();


        // camera
        this.camera.position.set(0, 0, - 1000);

        // scene
        this.scene.background = new THREE.Color(0x000000);
        this.scene.add(this.camera);
        document.getElementById("animation").appendChild(this.renderer.domElement);

        this.globe.add(this.particleSystem);
        this.scene.add(this.globe);
        this.globe.add(this.dots);

        // point on the sphere
        const loader = new THREE.TextureLoader();

        // starfield
        loader.load("textures/starfield.png", texture => {
            this.galaxyMaterial.map = texture;
            this.scene.add(this.galaxy);
        });

        loader.load("textures/earth.edited.jpg", texture => {
            const sphere = new THREE.SphereGeometry(this.globeRadius, 50, 50);
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

    /**
     *
     */
    render() {
        let currUpdate = Date.now();
        const delta = (currUpdate - this.lastUpdate) * 0.001;
        this.tick += delta;

        // globe rotation
        this.globeRotationVelocity += - .85 * this.globeRotationVelocity * delta;
        this.globe.rotation.y += this.globeRotationVelocity * delta;
        this.galaxy.rotation.y += 0.004 * delta;

        // particles
        for (let event of this.events) {
            this.particleOptions.position = event.position;
            this.particleOptions.velocity.x = (Math.random() - .5) * 1.5;
            this.particleOptions.velocity.y = (Math.random() - .5) * 1.5;
            this.particleOptions.velocity.z = (Math.random() - .5) * 1.5;
            if (event.tone < 0)
                this.particleOptions.color = 0xFC030D;
            else
                this.particleOptions.color = 0x1EFFF9;
            this.particleSystem.spawnParticle(this.particleOptions);
        }
        this.particleSystem.update(this.tick);

        // mouse control
        this.orbitControls.update();

        this.renderer.render(this.scene, this.camera);
        this.lastUpdate = currUpdate;
        requestAnimationFrame(() => this.render());
    }
}
