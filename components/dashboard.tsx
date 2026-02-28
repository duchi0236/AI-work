'use client';

import { useState } from 'react';
import { AgentCard } from '@/components/agents/agent-card';
import { Agent } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';

const mockAgents: Agent[] = [
  {
    id: 'interior-designer-1',
    name: 'Interior Designer Pro',
    role: {
      id: 'interior-designer',
      name: 'Interior Designer',
      description: 'Professional interior design expert',
      domain: 'interior-design',
      requiredSkills: ['spatial-analysis', 'material-selection', '3d-modeling'],
    },
    skills: [
      {
        id: 'spatial-analysis',
        name: 'Spatial Analysis',
        description: 'Analyze floor plans and spatial relationships',
        functions: [],
        category: 'analysis',
      },
      {
        id: 'material-selection',
        name: 'Material Selection',
        description: 'Recommend appropriate materials and finishes',
        functions: [],
        category: 'design',
      },
      {
        id: '3d-modeling',
        name: '3D Modeling',
        description: 'Create detailed 3D models of interior spaces',
        functions: [],
        category: 'visualization',
      },
    ],
    tools: [],
    description: 'Expert in creating beautiful and functional interior spaces',
    avatar: '/avatars/interior-designer.png',
  },
  {
    id: 'legal-advisor-1',
    name: 'Legal Advisor',
    role: {
      id: 'legal-advisor',
      name: 'Legal Advisor',
      description: 'Legal consultation and document review',
      domain: 'legal',
      requiredSkills: ['contract-review', 'legal-research', 'compliance-check'],
    },
    skills: [],
    tools: [],
    description: 'Provides legal advice and document analysis',
    avatar: '/avatars/legal-advisor.png',
  },
];

export function Dashboard() {
  const [agents] = useState<Agent[]>(mockAgents);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Agent Platform</h1>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <PlusIcon className="h-5 w-5" />
            Create New Agent
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How it works</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Select an AI employee specialized in your needs</li>
              <li>Describe your requirements and upload any relevant files</li>
              <li>Receive professional-grade output with interactive 3D visualization when applicable</li>
              <li>Iterate and refine until you're satisfied with the results</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}