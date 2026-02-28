export interface Agent {
  id: string;
  name: string;
  role: Role;
  skills: Skill[];
  tools: Tool[];
  description: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  domain: string; // e.g., 'interior-design', 'legal', 'finance'
  requiredSkills: string[];
  capabilities: string[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  functions: FunctionMetadata[];
  category: string;
  version: string;
}

export interface FunctionMetadata {
  name: string;
  description: string;
  parameters: Record<string, any>;
  returnType: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'file' | 'web' | 'custom';
  config: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  agentId: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ThreeDSceneData {
  sceneId: string;
  objects: ThreeDObject[];
  materials: Material[];
  lighting: LightingConfig;
  camera: CameraConfig;
}

export interface ThreeDObject {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  properties: Record<string, any>;
}

export interface Material {
  id: string;
  name: string;
  type: string;
  properties: Record<string, any>;
}

export interface LightingConfig {
  ambient: number;
  directional: DirectionalLight[];
  point: PointLight[];
}

export interface DirectionalLight {
  color: string;
  intensity: number;
  position: [number, number, number];
}

export interface PointLight {
  color: string;
  intensity: number;
  position: [number, number, number];
  distance: number;
}

export interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  near: number;
  far: number;
}