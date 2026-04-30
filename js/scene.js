/**
 * 3D Scene Module
 * Creates and manages the 3D laboratory environment
 */

class LabScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = document.getElementById('canvas-container');
        this.isInitialized = false;
        this.objects = {};
        this.lights = {};
        this.useWebGL = false;
        this.init();
    }

    init() {
        // Check if Three.js is available
        if (typeof THREE !== 'undefined') {
            this.initThreeJS();
        } else {
            this.initCanvasFallback();
        }
        this.isInitialized = true;
    }

    initThreeJS() {
            try {
                this.useWebGL = true;
        
                // Scene setup
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x1a1a2e);
                this.scene.fog = new THREE.Fog(0x1a1a2e, 50, 100);
    
                // Camera setup
                this.camera = new THREE.PerspectiveCamera(
                    75,
                    this.container.clientWidth / this.container.clientHeight,
                    0.1,
                    1000
                );
                this.camera.position.set(0, 2, 4);
                this.camera.lookAt(0, 1, 0);
    
                // Renderer setup - this is where WebGL context creation happens
                this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
                this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
                this.container.appendChild(this.renderer.domElement);
    
                // Create lab environment
                this.createLabEnvironment();
                this.createLighting();
                this.createTachistoscope();
                this.createFurniture();
    
                // Start animation loop
                this.animate();
    
                // Handle window resize
                window.addEventListener('resize', () => this.onWindowResize());
            } catch (error) {
                console.warn('WebGL not supported or context creation failed:', error);
                this.useWebGL = false;
                // Fallback to Canvas 2D rendering
                this.initCanvasFallback();
            }
    }

    createLabEnvironment() {
        // Floor
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a4a5e,
            roughness: 0.8,
            metalness: 0.2
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        this.objects.floor = floor;

        // Walls
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4d4d8,
            roughness: 0.9,
            metalness: 0
        });

        // Back wall
        const backWallGeometry = new THREE.PlaneGeometry(20, 15);
        const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
        backWall.position.z = -10;
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Left wall
        const leftWallGeometry = new THREE.PlaneGeometry(20, 15);
        const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.x = -10;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Right wall
        const rightWall = leftWall.clone();
        rightWall.position.x = 10;
        this.scene.add(rightWall);

        // Ceiling
        const ceilingGeometry = new THREE.PlaneGeometry(20, 20);
        const ceilingMaterial = new THREE.MeshStandardMaterial({
            color: 0xf0f0f5,
            roughness: 0.9
        });
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 8;
        ceiling.receiveShadow = true;
        this.scene.add(ceiling);
    }

    createLighting() {
        // Ambient light - soft overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        this.lights.ambient = ambientLight;

        // Main directional light - simulates window/overhead light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 8, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -15;
        directionalLight.shadow.camera.right = 15;
        directionalLight.shadow.camera.top = 15;
        directionalLight.shadow.camera.bottom = -15;
        this.scene.add(directionalLight);
        this.lights.directional = directionalLight;

        // Highlight light - gives equipment a professional look
        const spotLight = new THREE.SpotLight(0x667eea, 1);
        spotLight.position.set(2, 5, 2);
        spotLight.castShadow = true;
        spotLight.angle = Math.PI / 4;
        this.scene.add(spotLight);
        this.lights.spot = spotLight;
    }

    createTachistoscope() {
        const group = new THREE.Group();

        // Device body (main box)
        const bodyGeometry = new THREE.BoxGeometry(2, 1.2, 0.6);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a3e,
            roughness: 0.3,
            metalness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);

        // Display screen
        const screenGeometry = new THREE.BoxGeometry(1.8, 0.9, 0.1);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.2,
            metalness: 0.9,
            emissive: 0x00ff00,
            emissiveIntensity: 0.1
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.25;
        screen.castShadow = true;
        screen.receiveShadow = true;
        group.add(screen);
        this.objects.screen = screen;

        // Control panel base
        const panelGeometry = new THREE.BoxGeometry(2, 0.3, 0.5);
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.4,
            metalness: 0.6
        });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.y = -0.5;
        panel.castShadow = true;
        group.add(panel);

        // Buttons on control panel
        const buttonPositions = [
            { x: -0.6, label: 'START' },
            { x: -0.2, label: 'RESET' },
            { x: 0.2, label: 'NEXT' },
            { x: 0.6, label: 'EXIT' }
        ];

        buttonPositions.forEach(pos => {
            const buttonGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 32);
            const buttonMaterial = new THREE.MeshStandardMaterial({
                color: 0x667eea,
                roughness: 0.2,
                metalness: 0.8,
                emissive: 0x667eea,
                emissiveIntensity: 0.3
            });
            const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
            button.position.set(pos.x, -0.65, 0);
            button.castShadow = true;
            group.add(button);
        });

        // Position the entire tachistoscope
        group.position.set(0, 1.2, 0);
        this.scene.add(group);
        this.objects.tachistoscope = group;
    }

    createFurniture() {
        // Desk
        const deskTopGeometry = new THREE.BoxGeometry(3, 0.1, 1.5);
        const deskMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            roughness: 0.6,
            metalness: 0.2
        });
        const deskTop = new THREE.Mesh(deskTopGeometry, deskMaterial);
        deskTop.position.set(0, 0.8, 0);
        deskTop.castShadow = true;
        deskTop.receiveShadow = true;
        this.scene.add(deskTop);

        // Desk legs
        const legGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.7,
            metalness: 0.1
        });

        const legPositions = [
            { x: -1.4, z: -0.6 },
            { x: -1.4, z: 0.6 },
            { x: 1.4, z: -0.6 },
            { x: 1.4, z: 0.6 }
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(pos.x, 0.4, pos.z);
            leg.castShadow = true;
            leg.receiveShadow = true;
            this.scene.add(leg);
        });

        // Chair (simplified)
        const chairSeatGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.6);
        const chairMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            roughness: 0.5,
            metalness: 0.3
        });
        const chairSeat = new THREE.Mesh(chairSeatGeometry, chairMaterial);
        chairSeat.position.set(0, 0.5, -2);
        chairSeat.castShadow = true;
        this.scene.add(chairSeat);

        // Shelves with books (background decoration)
        const shelfGeometry = new THREE.BoxGeometry(4, 0.1, 0.3);
        const shelfMaterial = new THREE.MeshStandardMaterial({
            color: 0xb8860b,
            roughness: 0.6,
            metalness: 0.1
        });

        for (let i = 0; i < 3; i++) {
            const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
            shelf.position.set(-6, 2 + i * 1.2, -9.8);
            shelf.castShadow = true;
            this.scene.add(shelf);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.useWebGL && this.renderer) {
            // Gentle rotation for tachistoscope for visual interest
            if (this.objects.tachistoscope) {
                this.objects.tachistoscope.rotation.y += 0.0005;
            }

            // Update screen glow
            if (this.objects.screen) {
                const intensity = 0.1 + Math.sin(Date.now() * 0.003) * 0.05;
                this.objects.screen.material.emissiveIntensity = intensity;
            }

            this.renderer.render(this.scene, this.camera);
        }
    }

    onWindowResize() {
        if (!this.useWebGL || !this.renderer || !this.camera) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    initCanvasFallback() {
           console.log('Initializing Canvas 2D fallback for lab environment');
        // Create a 2D canvas fallback if Three.js is not available
        const canvas = document.createElement('canvas');
        canvas.width = this.container.clientWidth;
        canvas.height = this.container.clientHeight;
        const ctx = canvas.getContext('2d');

        // Draw a gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw lab text
        ctx.fillStyle = '#667eea';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('3D Psychology Virtual Lab - Tachistoscope', canvas.width / 2, canvas.height / 2 - 40);

        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.fillText('WebGL not available - Using Canvas 2D Rendering', canvas.width / 2, canvas.height / 2);

        this.container.appendChild(canvas);
    }

    dispose() {
        if (this.useWebGL && this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

// Global scene instance
let labScene = null;

function initializeLabScene() {
    if (!labScene) {
        labScene = new LabScene();
    }
    return labScene;
}
