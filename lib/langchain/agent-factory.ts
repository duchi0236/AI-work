import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';
import { BaseMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Tool } from '@langchain/core/tools';
import { PromptTemplate } from '@langchain/core/prompts';
import { Agent } from '@/types';

interface AgentConfig {
  agent: Agent;
  tools: Tool[];
  modelName?: string;
}

export class AgentFactory {
  private static llmCache = new Map<string, ChatOpenAI>();

  static createAgentExecutor(config: AgentConfig): AgentExecutor {
    const { agent, tools, modelName = 'gpt-4-turbo-preview' } = config;
    
    // Get or create LLM instance
    let llm = this.llmCache.get(modelName);
    if (!llm) {
      llm = new ChatOpenAI({
        modelName,
        temperature: 0.7,
        maxTokens: 2000,
      });
      this.llmCache.set(modelName, llm);
    }

    // Create system prompt based on agent role and skills
    const systemPrompt = this.createSystemPrompt(agent);
    
    const prompt = PromptTemplate.fromTemplate(`
      {system_prompt}
      
      Current conversation:
      {chat_history}
      
      User input: {input}
      
      Available tools: {tools}
      
      Use the following format:
      Question: the input question you must answer
      Thought: you should always think about what to do
      Action: the action to take, should be one of [{tool_names}]
      Action Input: the input to the action
      Observation: the result of the action
      ... (this Thought/Action/Action Input/Observation can repeat N times)
      Thought: I now know the final answer
      Final Answer: the final answer to the original input question
      
      Begin!
      
      Question: {input}
      Thought: {agent_scratchpad}
    `);

    const agentRunnable = createToolCallingAgent({
      llm,
      tools,
      prompt,
    });

    return new AgentExecutor({
      agent: agentRunnable,
      tools,
      verbose: true,
      handleParsers: true,
    });
  }

  private static createSystemPrompt(agent: Agent): string {
    const skillDescriptions = agent.skills.map(skill => 
      `- ${skill.name}: ${skill.description}`
    ).join('\n');

    return `
      You are ${agent.name}, a professional AI employee specializing in ${agent.role.domain}.
      
      Your role: ${agent.role.name}
      Role description: ${agent.role.description}
      
      Your skills:
      ${skillDescriptions}
      
      You must provide expert-level responses in your domain. Be precise, professional, and helpful.
      When asked to generate 3D content or visualizations, provide structured data that can be rendered in WebGL.
      Always consider the user's specific needs and constraints.
      
      If you need to use tools, use them appropriately. If you cannot answer with the available tools, 
      clearly state your limitations.
    `;
  }
}