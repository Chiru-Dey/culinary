// ==========================================
// THREE.JS 3D SCENE - Spice Visualization
// ==========================================

class SpiceScene {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.spiceObjects = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.createLights();
        this.createSpiceObjects();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x1a1a1a, 10, 50);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 15;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Directional lights for dramatic effect
        const light1 = new THREE.DirectionalLight(0xFF9933, 1);
        light1.position.set(5, 5, 5);
        this.scene.add(light1);
        
        const light2 = new THREE.DirectionalLight(0xFFC107, 0.8);
        light2.position.set(-5, -5, -5);
        this.scene.add(light2);
        
        // Point light for warmth
        const pointLight = new THREE.PointLight(0xFFD700, 1, 100);
        pointLight.position.set(0, 0, 10);
        this.scene.add(pointLight);
    }
    
    createSpiceObjects() {
        // Create various geometric shapes representing spice containers
        const geometries = [
            new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32),
            new THREE.TorusGeometry(0.7, 0.3, 16, 100),
            new THREE.OctahedronGeometry(0.8, 0),
            new THREE.IcosahedronGeometry(0.7, 0),
        ];
        
        const materials = [
            new THREE.MeshStandardMaterial({ 
                color: 0xFF9933,
                metalness: 0.7,
                roughness: 0.3,
                emissive: 0xFF9933,
                emissiveIntensity: 0.2
            }),
            new THREE.MeshStandardMaterial({ 
                color: 0xFFC107,
                metalness: 0.6,
                roughness: 0.4,
                emissive: 0xFFC107,
                emissiveIntensity: 0.2
            }),
            new THREE.MeshStandardMaterial({ 
                color: 0xD32F2F,
                metalness: 0.8,
                roughness: 0.2,
                emissive: 0xD32F2F,
                emissiveIntensity: 0.3
            }),
            new THREE.MeshStandardMaterial({ 
                color: 0x8BC34A,
                metalness: 0.5,
                roughness: 0.5,
                emissive: 0x8BC34A,
                emissiveIntensity: 0.2
            }),
        ];
        
        for (let i = 0; i < 4; i++) {
            const mesh = new THREE.Mesh(geometries[i], materials[i]);
            
            // Position in a circular pattern
            const angle = (i / 4) * Math.PI * 2;
            const radius = 5;
            mesh.position.x = Math.cos(angle) * radius;
            mesh.position.y = Math.sin(angle) * radius;
            mesh.position.z = -2;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            this.spiceObjects.push({
                mesh: mesh,
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                }
            });
            
            this.scene.add(mesh);
        }
    }
    
    createParticles() {
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const spiceColors = [
            new THREE.Color(0xFF9933),
            new THREE.Color(0xFFC107),
            new THREE.Color(0xD32F2F),
            new THREE.Color(0x8BC34A)
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 30;
            positions[i3 + 1] = (Math.random() - 0.5) * 30;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
            
            // Color
            const color = spiceColors[Math.floor(Math.random() * spiceColors.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    }
    
    setupEventListeners() {
        // Mouse move for camera interaction
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate spice objects
        this.spiceObjects.forEach(obj => {
            obj.mesh.rotation.x += obj.rotationSpeed.x;
            obj.mesh.rotation.y += obj.rotationSpeed.y;
            obj.mesh.rotation.z += obj.rotationSpeed.z;
        });
        
        // Rotate particle system
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.001;
        }
        
        // Camera follows mouse subtly
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SpiceScene();
    });
} else {
    new SpiceScene();
}
