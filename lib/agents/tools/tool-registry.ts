import { Tool } from '@langchain/core/tools';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

// 室内设计相关工具
export const createFloorPlanAnalyzer = (): Tool => {
  return new DynamicStructuredTool({
    name: 'analyze_floor_plan',
    description: '分析上传的户型图，提取房间尺寸、门窗位置等信息',
    schema: z.object({
      image_url: z.string().describe('户型图的URL'),
      format: z.enum(['png', 'jpg', 'pdf']).optional().describe('图像格式'),
    }),
    func: async ({ image_url, format }) => {
      // 这里会集成计算机视觉API来分析户型图
      // 返回结构化的房间信息
      return JSON.stringify({
        rooms: [
          { name: '客厅', width: 5.2, length: 4.8, area: 24.96 },
          { name: '卧室', width: 3.6, length: 3.2, area: 11.52 },
          { name: '厨房', width: 2.8, length: 2.4, area: 6.72 },
          { name: '卫生间', width: 2.0, length: 1.8, area: 3.6 }
        ],
        doors: [{ room: '客厅', position: 'north', width: 0.9 }],
        windows: [{ room: '客厅', position: 'south', width: 1.8 }],
        total_area: 46.8
      });
    }
  });
};

export const createMaterialSelector = (): Tool => {
  return new DynamicStructuredTool({
    name: 'select_materials',
    description: '根据风格偏好和预算选择合适的装修材料',
    schema: z.object({
      style: z.enum(['modern', 'traditional', 'industrial', 'scandinavian', 'minimalist']),
      budget_level: z.enum(['low', 'medium', 'high']),
      room_type: z.string().describe('房间类型'),
      area: z.number().describe('房间面积（平方米）'),
    }),
    func: async ({ style, budget_level, room_type, area }) => {
      // 根据风格和预算推荐材料
      const materials = {
        flooring: '',
        walls: '',
        ceiling: '',
        furniture: ''
      };
      
      switch (style) {
        case 'modern':
          materials.flooring = budget_level === 'high' ? 'marble' : 'laminate';
          materials.walls = 'paint';
          materials.ceiling = 'gypsum_board';
          materials.furniture = budget_level === 'high' ? 'custom_made' : 'ready_made';
          break;
        case 'scandinavian':
          materials.flooring = 'light_wood';
          materials.walls = 'white_paint';
          materials.ceiling = 'white_paint';
          materials.furniture = 'light_wood_furniture';
          break;
        // 其他风格...
      }
      
      return JSON.stringify(materials);
    }
  });
};

export const create3DModelGenerator = (): Tool => {
  return new DynamicStructuredTool({
    name: 'generate_3d_model',
    description: '基于房间布局和材料选择生成3D模型数据',
    schema: z.object({
      room_layout: z.object({
        rooms: z.array(z.object({
          name: z.string(),
          width: z.number(),
          length: z.number(),
          height: z.number().optional(),
          position: z.object({ x: z.number(), y: z.number() }).optional()
        })),
        doors: z.array(z.object({
          from: z.string(),
          to: z.string(),
          width: z.number()
        })).optional(),
        windows: z.array(z.object({
          room: z.string(),
          wall: z.string(),
          width: z.number(),
          height: z.number()
        })).optional()
      }),
      materials: z.object({
        flooring: z.string(),
        walls: z.string(),
        ceiling: z.string(),
        furniture: z.string()
      })
    }),
    func: async ({ room_layout, materials }) => {
      // 生成Three.js兼容的3D场景数据
      const sceneData = {
        type: 'scene',
        children: [],
        materials: materials,
        metadata: {
          generator: 'AI Agent Platform',
          version: '1.0'
        }
      };
      
      // 为每个房间创建几何体
      room_layout.rooms.forEach(room => {
        sceneData.children.push({
          type: 'room',
          name: room.name,
          dimensions: {
            width: room.width,
            length: room.length,
            height: room.height || 2.8
          },
          position: room.position || { x: 0, y: 0 },
          materials: materials
        });
      });
      
      return JSON.stringify(sceneData);
    }
  });
};

// 工具注册表
export const TOOL_REGISTRY: Record<string, () => Tool> = {
  'analyze_floor_plan': createFloorPlanAnalyzer,
  'select_materials': createMaterialSelector,
  'generate_3d_model': create3DModelGenerator,
  // 可以添加更多工具...
};

export const getToolByName = (name: string): Tool | undefined => {
  const toolFactory = TOOL_REGISTRY[name];
  return toolFactory ? toolFactory() : undefined;
};

export const getAllTools = (): Tool[] => {
  return Object.values(TOOL_REGISTRY).map(factory => factory());
};