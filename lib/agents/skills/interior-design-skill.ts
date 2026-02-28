import { Tool } from '@langchain/core/tools';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { z } from 'zod';

// 室内设计技能的输入验证
const InteriorDesignInput = z.object({
  roomType: z.string().describe('房间类型，如客厅、卧室、厨房等'),
  stylePreference: z.string().describe('设计风格偏好，如现代、北欧、工业风等'),
  dimensions: z.object({
    width: z.number().describe('房间宽度（米）'),
    length: z.number().describe('房间长度（米）'),
    height: z.number().describe('房间高度（米）'),
  }).optional(),
  existingFurniture: z.array(z.string()).optional().describe('现有家具列表'),
  budget: z.number().optional().describe('预算范围（元）'),
  specialRequirements: z.string().optional().describe('特殊需求，如无障碍设计、儿童安全等'),
});

// 室内设计工具
export class InteriorDesignTool extends Tool {
  name = 'interior_design';
  description = '专业的室内设计工具，能够根据用户需求生成空间布局和设计方案';

  constructor(private model: BaseChatModel) {
    super();
  }

  async _call(input: string): Promise<string> {
    try {
      // 解析输入
      const parsedInput = JSON.parse(input);
      const validatedInput = InteriorDesignInput.parse(parsedInput);

      // 构建提示词
      const prompt = this.buildDesignPrompt(validatedInput);
      
      // 调用AI模型生成设计方案
      const response = await this.model.invoke([
        {
          role: 'system',
          content: '你是一位专业的室内设计师，需要根据客户需求生成详细的设计方案，包括空间布局、材料选择、色彩搭配等。'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      // 处理响应并生成3D场景数据
      const designData = this.processDesignResponse(response.content as string);
      
      return JSON.stringify(designData);
    } catch (error) {
      console.error('Interior design tool error:', error);
      return JSON.stringify({
        error: '无法生成设计方案，请检查输入参数',
        success: false
      });
    }
  }

  private buildDesignPrompt(input: z.infer<typeof InteriorDesignInput>): string {
    let prompt = `请为以下房间生成专业的室内设计方案：

房间类型: ${input.roomType}
设计风格: ${input.stylePreference}`;

    if (input.dimensions) {
      prompt += `
房间尺寸: ${input.dimensions.width}m × ${input.dimensions.length}m × ${input.dimensions.height}m`;
    }

    if (input.existingFurniture && input.existingFurniture.length > 0) {
      prompt += `
现有家具: ${input.existingFurniture.join(', ')}`;
    }

    if (input.budget) {
      prompt += `
预算范围: ¥${input.budget.toLocaleString()}`;
    }

    if (input.specialRequirements) {
      prompt += `
特殊需求: ${input.specialRequirements}`;
    }

    prompt += `

请提供以下内容：
1. 空间布局建议（包括家具摆放位置）
2. 色彩搭配方案
3. 材料和饰面选择
4. 照明设计方案
5. 3D场景数据（JSON格式，包含物体位置、材质、尺寸等信息）

请确保设计方案实用、美观且符合用户需求。`;

    return prompt;
  }

  private processDesignResponse(response: string): any {
    // 这里可以添加更复杂的响应处理逻辑
    // 目前直接返回原始响应，实际项目中可能需要解析和结构化
    try {
      // 尝试解析可能的JSON响应
      return JSON.parse(response);
    } catch {
      // 如果不是JSON，返回结构化响应
      return {
        textResponse: response,
        threeJSData: {
          scene: {
            objects: [],
            materials: [],
            lighting: []
          }
        },
        success: true
      };
    }
  }
}