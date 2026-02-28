import * as THREE from 'three';

export interface SceneData {
  type: 'interior-design' | 'product-showcase' | 'architectural';
  dimensions: { width: number; height: number; depth: number };
  materials: MaterialData[];
  furniture: FurnitureData[];
  lighting: LightingData[];
}

export interface MaterialData {
  id: string;
  name: string;
  type: 'wall' | 'floor' | 'ceiling' | 'furniture';
  color?: string;
  textureUrl?: string;
  roughness?: number;
  metalness?: number;
}

export interface FurnitureData {
  id: string;
  name: string;
  modelUrl: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface LightingData {
  id: string;
  type: 'ambient' | 'directional' | 'point' | 'spot';
  intensity: number;
  position?: { x: number; y: number; z: number };
  color?: string;
}

export class SceneBuilder {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 5);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    
    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  public buildScene(sceneData: SceneData): void {
    // Clear existing scene
    while(this.scene.children.length > 0) { 
      this.scene.remove(this.scene.children[0]); 
    }
    
    // Build based on scene type
    switch(sceneData.type) {
      case 'interior-design':
        this.buildInteriorScene(sceneData);
        break;
      default:
        this.buildDefaultScene();
    }
  }

  private buildInteriorScene(sceneData: SceneData): void {
    // Create room structure
    const roomGroup = new THREE.Group();
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(sceneData.dimensions.width, sceneData.dimensions.depth);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -sceneData.dimensions.height / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);
    
    // Walls (simplified - just back wall for demo)
    const wallGeometry = new THREE.PlaneGeometry(sceneData.dimensions.width, sceneData.dimensions.height);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF,
      roughness: 0.9
    });
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.z = -sceneData.dimensions.depth / 2;
    wall.position.y = 0;
    wall.receiveShadow = true;
    roomGroup.add(wall);
    
    // Add furniture
    sceneData.furniture.forEach(furniture => {
      // In a real implementation, you would load the actual 3D model
      // For now, we'll create simple placeholder geometries
      const furnitureMesh = this.createFurniturePlaceholder(furniture);
      roomGroup.add(furnitureMesh);
    });
    
    this.scene.add(roomGroup);
  }

  private createFurniturePlaceholder(furniture: FurnitureData): THREE.Mesh {
    // Create a simple box as placeholder
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.7,
      metalness: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(furniture.position.x, furniture.position.y, furniture.position.z);
    mesh.rotation.set(furniture.rotation.x, furniture.rotation.y, furniture.rotation.z);
    mesh.scale.set(furniture.scale.x, furniture.scale.y, furniture.scale.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  }

  private buildDefaultScene(): void {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  public animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    if (this.renderer.domElement.parentElement) {
      const container = this.renderer.domElement.parentElement;
      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
  }

  public dispose(): void {
    this.renderer.dispose();
    // Clean up scene objects
    this.scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => mat.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      }
    });
  }
}