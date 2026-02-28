import { AgentList } from '@/components/agents/agent-list';
import { CreateAgentForm } from '@/components/agents/create-agent-form';

export default function AgentsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Agents Management</h1>
        <CreateAgentForm />
      </div>
      <AgentList />
    </div>
  );
}