import { NextRequest } from 'next/server';
import { AgentManager } from '@/lib/agents/agent-manager';
import { AgentMessage, ChatResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { agentId, message, context } = await request.json();
    
    if (!agentId || !message) {
      return Response.json(
        { error: 'agentId and message are required' },
        { status: 400 }
      );
    }

    const agentManager = new AgentManager();
    const agent = await agentManager.getAgent(agentId);
    
    if (!agent) {
      return Response.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Process the message with the agent
    const response = await agent.processMessage({
      content: message,
      role: 'user',
      timestamp: new Date().toISOString(),
    });

    // Handle different response types
    let chatResponse: ChatResponse;
    
    if (response.type === 'text') {
      chatResponse = {
        type: 'text',
        content: response.content,
        agentId: agent.id,
        timestamp: new Date().toISOString(),
      };
    } else if (response.type === '3d-scene') {
      chatResponse = {
        type: '3d-scene',
        sceneData: response.sceneData,
        agentId: agent.id,
        timestamp: new Date().toISOString(),
      };
    } else {
      chatResponse = {
        type: 'text',
        content: JSON.stringify(response),
        agentId: agent.id,
        timestamp: new Date().toISOString(),
      };
    }

    return Response.json(chatResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}