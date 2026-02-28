import { Agent, Role, Skill, Tool } from '@/types';
import { createAgentFromRole } from '../langchain/agent-factory';

export class AgentManager {
  private agents: Map<string, Agent> = new Map();
  private roles: Map<string, Role> = new Map();
  private skills: Map<string, Skill> = new Map();
  private tools: Map<string, Tool> = new Map();

  // Agent Management
  async createAgent(name: string, roleId: string, description?: string): Promise<Agent> {
    const role = this.roles.get(roleId);
    if (!role) {
      throw new Error(`Role ${roleId} not found`);
    }

    const agent: Agent = {
      id: `agent_${Date.now()}`,
      name,
      role,
      skills: role.requiredSkills.map(skillId => this.skills.get(skillId)!),
      tools: [], // Will be populated based on role and skills
      description: description || `AI ${role.name} specializing in ${role.domain}`,
    };

    this.agents.set(agent.id, agent);
    return agent;
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  deleteAgent(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  // Role Management
  addRole(role: Role): void {
    this.roles.set(role.id, role);
  }

  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }

  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  // Skill Management
  addSkill(skill: Skill): void {
    this.skills.set(skill.id, skill);
  }

  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  // Tool Management
  addTool(tool: Tool): void {
    this.tools.set(tool.id, tool);
  }

  getTool(toolId: string): Tool | undefined {
    return this.tools.get(toolId);
  }

  // Process User Request
  async processRequest(agentId: string, message: string, context?: any): Promise<any> {
    const agent = this.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Create LangChain agent instance
    const langchainAgent = await createAgentFromRole(agent.role, agent.skills, agent.tools);
    
    // Process the request
    const response = await langchainAgent.invoke({
      input: message,
      context: context || {}
    });

    return response;
  }

  // Initialize with default roles and skills
  initializeDefaultAgents(): void {
    // Interior Design Role
    const interiorDesignRole: Role = {
      id: 'interior-design',
      name: 'Interior Designer',
      description: 'Professional interior designer specializing in space planning and decoration',
      domain: 'interior-design',
      requiredSkills: ['space-planning', 'material-selection', '3d-modeling']
    };

    // Legal Advisor Role
    const legalAdvisorRole: Role = {
      id: 'legal-advisor',
      name: 'Legal Advisor',
      description: 'Legal professional providing advice on various legal matters',
      domain: 'legal',
      requiredSkills: ['legal-research', 'contract-analysis', 'case-law']
    };

    // Financial Advisor Role
    const financialAdvisorRole: Role = {
      id: 'financial-advisor',
      name: 'Financial Advisor',
      description: 'Financial professional providing investment and planning advice',
      domain: 'finance',
      requiredSkills: ['investment-analysis', 'risk-assessment', 'financial-planning']
    };

    // Add roles
    this.addRole(interiorDesignRole);
    this.addRole(legalAdvisorRole);
    this.addRole(financialAdvisorRole);

    // Add skills
    this.addSkill({
      id: 'space-planning',
      name: 'Space Planning',
      description: 'Analyzes floor plans and creates optimal space layouts',
      functions: [],
      category: 'design'
    });

    this.addSkill({
      id: 'material-selection',
      name: 'Material Selection',
      description: 'Recommends appropriate materials for different applications',
      functions: [],
      category: 'design'
    });

    this.addSkill({
      id: '3d-modeling',
      name: '3D Modeling',
      description: 'Creates 3D models and renders for visualization',
      functions: [],
      category: 'visualization'
    });

    this.addSkill({
      id: 'legal-research',
      name: 'Legal Research',
      description: 'Conducts comprehensive legal research and analysis',
      functions: [],
      category: 'legal'
    });

    this.addSkill({
      id: 'contract-analysis',
      name: 'Contract Analysis',
      description: 'Reviews and analyzes legal contracts',
      functions: [],
      category: 'legal'
    });

    this.addSkill({
      id: 'investment-analysis',
      name: 'Investment Analysis',
      description: 'Analyzes investment opportunities and provides recommendations',
      functions: [],
      category: 'finance'
    });
  }
}