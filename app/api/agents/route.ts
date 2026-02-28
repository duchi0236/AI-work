import { NextRequest } from 'next/server';
import { AgentManager } from '@/lib/agents/agent-manager';
import { Agent, Role, Skill } from '@/types';

const agentManager = new AgentManager();

export async function GET(request: NextRequest) {
  try {
    const agents = await agentManager.listAgents();
    return Response.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return Response.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, roleId, skillIds, description, avatar } = data;
    
    const agent = await agentManager.createAgent({
      name,
      roleId,
      skillIds,
      description,
      avatar,
    });
    
    return Response.json({ agent });
  } catch (error) {
    console.error('Error creating agent:', error);
    return Response.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}