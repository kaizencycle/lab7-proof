// OAA Central Hub - Frontend Tab Component
// React component for Lab4 frontend integration

import React, { useState, useEffect } from 'react';

interface OaaCard {
  id: string;
  title: string;
  content: any;
  status: 'success' | 'warning' | 'error' | 'pending';
  timestamp: Date;
  tool: string;
  execution_time_ms: number;
}

interface OaaStatus {
  hub: {
    name: string;
    version: string;
    status: string;
  };
  labs: Array<{
    id: string;
    name: string;
    status: string;
    healthy: boolean;
    last_check?: Date;
  }>;
  tools: Array<{
    name: string;
    available: boolean;
    success_rate?: number;
    last_used?: Date;
  }>;
}

export default function OaaTab() {
  const [cards, setCards] = useState<OaaCard[]>([]);
  const [status, setStatus] = useState<OaaStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh status every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Initial load
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/oaa/status');
      const data = await response.json();
      
      if (data.ok) {
        setStatus(data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    }
  };

  const executePlan = async (goal: string) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Plan
      const planResponse = await fetch('/oaa/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goals: { type: goal, description: goal },
          state: { current_step: 'planning' },
          context: { user_initiated: true }
        })
      });

      const planData = await planResponse.json();
      
      if (!planData.ok) {
        throw new Error(planData.error || 'Planning failed');
      }

      // Add planning card
      const planningCard: OaaCard = {
        id: `plan_${Date.now()}`,
        title: 'Planning Phase',
        content: planData.plan,
        status: 'success',
        timestamp: new Date(),
        tool: 'jade',
        execution_time_ms: 0
      };
      setCards(prev => [planningCard, ...prev]);

      // Step 2: Act (if plan has a tool)
      if (planData.plan.tool) {
        const actResponse = await fetch('/oaa/act', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: planData.plan.tool,
            args: planData.plan.args,
            context: { plan_id: planningCard.id }
          })
        });

        const actData = await actResponse.json();
        
        const actionCard: OaaCard = {
          id: `act_${Date.now()}`,
          title: `Action: ${planData.plan.tool}`,
          content: actData.data,
          status: actData.ok ? 'success' : 'error',
          timestamp: new Date(),
          tool: planData.plan.tool,
          execution_time_ms: actData.meta?.execution_time_ms || 0
        };
        setCards(prev => [actionCard, ...prev]);

        if (!actData.ok) {
          throw new Error(actData.error || 'Action failed');
        }
      }

    } catch (err) {
      const errorCard: OaaCard = {
        id: `error_${Date.now()}`,
        title: 'Execution Error',
        content: { error: err instanceof Error ? err.message : String(err) },
        status: 'error',
        timestamp: new Date(),
        tool: 'unknown',
        execution_time_ms: 0
      };
      setCards(prev => [errorCard, ...prev]);
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setLoading(false);
    }
  };

  const clearCards = () => {
    setCards([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  return (
    <section className="oaa-tab p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🧠 OAA Central Hub
        </h2>
        <p className="text-gray-600">
          Plan • Act • Learn • Seal — Central nervous system for all labs and tools
        </p>
      </div>

      {/* Status Overview */}
      {status && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">System Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700">Hub</h4>
              <p className="text-sm text-gray-600">{status.hub.name} v{status.hub.version}</p>
              <span className={`inline-block px-2 py-1 rounded text-xs ${
                status.hub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {status.hub.status}
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700">Labs</h4>
              <p className="text-sm text-gray-600">
                {status.labs.filter(l => l.healthy).length} / {status.labs.length} healthy
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-700">Tools</h4>
              <p className="text-sm text-gray-600">
                {status.tools.filter(t => t.available).length} / {status.tools.length} available
              </p>
            </div>
          </div>

          {/* Lab Status */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Lab Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {status.labs.map(lab => (
                <div key={lab.id} className="flex items-center space-x-2 text-sm">
                  <span className={lab.healthy ? 'text-green-500' : 'text-red-500'}>
                    {lab.healthy ? '●' : '●'}
                  </span>
                  <span className="text-gray-600">{lab.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tool Status */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Tool Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {status.tools.map(tool => (
                <div key={tool.name} className="flex items-center space-x-2 text-sm">
                  <span className={tool.available ? 'text-green-500' : 'text-red-500'}>
                    {tool.available ? '●' : '●'}
                  </span>
                  <span className="text-gray-600">{tool.name}</span>
                  {tool.success_rate && (
                    <span className="text-xs text-gray-500">
                      ({Math.round(tool.success_rate)}%)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => executePlan('fetch_data')}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Executing...' : 'Fetch Data'}
          </button>
          
          <button
            onClick={() => executePlan('health_check')}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Health Check
          </button>
          
          <button
            onClick={fetchStatus}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh Status
          </button>
          
          <button
            onClick={clearCards}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Cards
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            Auto-refresh (30s)
          </label>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">❌</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Cards Display */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Execution Cards</h3>
          <span className="text-sm text-gray-500">{cards.length} cards</span>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No execution cards yet. Try running a quick action above.
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map(card => (
              <div key={card.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(card.status)}</span>
                    <h4 className="font-semibold text-gray-900">{card.title}</h4>
                    <span className={`text-sm ${getStatusColor(card.status)}`}>
                      {card.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {card.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Tool:</strong> {card.tool} | 
                    <strong> Execution Time:</strong> {card.execution_time_ms}ms
                  </div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(card.content, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}