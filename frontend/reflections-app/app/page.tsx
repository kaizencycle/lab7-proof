'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

interface OAAStatus {
  status: 'online' | 'offline' | 'loading';
  services: {
    name: string;
    status: 'running' | 'stopped' | 'error';
    uptime: string;
    version: string;
  }[];
}

export default function Home() {
  const [status, setStatus] = useState<OAAStatus>({
    status: 'loading',
    services: []
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'console' | 'logs'>('overview');

  useEffect(() => {
    // Simulate loading OAA status
    setTimeout(() => {
      setStatus({
        status: 'online',
        services: [
          { name: 'OAA Core', status: 'running', uptime: '2d 14h 32m', version: 'v1.2.3' },
          { name: 'PAL Engine', status: 'running', uptime: '1d 8h 15m', version: 'v2.1.0' },
          { name: 'Zeus Gateway', status: 'running', uptime: '3d 2h 45m', version: 'v1.5.2' },
          { name: 'Echo Bridge', status: 'running', uptime: '5d 12h 30m', version: 'v1.0.8' },
          { name: 'Health Sentinel', status: 'running', uptime: '1w 2d 4h', version: 'v3.2.1' }
        ]
      });
    }, 1500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'stopped': return 'text-red-400';
      case 'error': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return '●';
      case 'stopped': return '●';
      case 'error': return '●';
      default: return '○';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OAA</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Open Attestation Authority</h1>
                <p className="text-sm text-gray-400">STEM Apprenticeship Engine</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${status.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm text-gray-300">
                  {status.status === 'loading' ? 'Loading...' : status.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-700 bg-gray-800">
        <div className="px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'models', label: 'Models' },
              { id: 'console', label: 'Console' },
              { id: 'logs', label: 'Logs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">System Status</h3>
                    <p className="text-2xl font-bold text-green-400 mt-2">Healthy</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-2xl">✓</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Active Services</h3>
                    <p className="text-2xl font-bold text-blue-400 mt-2">{status.services.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-2xl">⚙</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Attestations</h3>
                    <p className="text-2xl font-bold text-purple-400 mt-2">1,247</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-2xl">🔐</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Services</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {status.services.map((service, index) => (
                  <div key={index} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`text-lg ${getStatusColor(service.status)}`}>
                        {getStatusIcon(service.status)}
                      </span>
                      <div>
                        <h4 className="font-medium text-white">{service.name}</h4>
                        <p className="text-sm text-gray-400">v{service.version}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Uptime: {service.uptime}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        service.status === 'running' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* OAA Core Model */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">OAA Core</h3>
                    <p className="text-sm text-gray-400">Attestation Engine</p>
                  </div>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">v1.2.3</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Cryptographic verification and digital integrity services for educational credentials.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm">● Running</span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">Configure</button>
                </div>
              </div>

              {/* PAL Engine Model */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">PAL Engine</h3>
                    <p className="text-sm text-gray-400">Policy as Learning</p>
                  </div>
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">v2.1.0</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Adaptive learning policies with canary rollouts and safety gates.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm">● Running</span>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">Configure</button>
                </div>
              </div>

              {/* Zeus Gateway Model */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Zeus Gateway</h3>
                    <p className="text-sm text-gray-400">Quality Gates</p>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">v1.5.2</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Quality gates and safety checks for model promotion workflows.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 text-sm">● Running</span>
                  <button className="text-yellow-400 hover:text-yellow-300 text-sm">Configure</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'console' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">OAA Console</h3>
            </div>
            <div className="p-6">
              <div className="bg-black rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400">$ oaa status</div>
                <div className="text-white mt-2">
                  <div>OAA Core: ✓ Running (v1.2.3)</div>
                  <div>PAL Engine: ✓ Running (v2.1.0)</div>
                  <div>Zeus Gateway: ✓ Running (v1.5.2)</div>
                  <div>Echo Bridge: ✓ Running (v1.0.8)</div>
                  <div>Health Sentinel: ✓ Running (v3.2.1)</div>
                </div>
                <div className="text-green-400 mt-4">$ oaa attest --help</div>
                <div className="text-white mt-2">
                  <div>Usage: oaa attest [options] &lt;data&gt;</div>
                  <div>Options:</div>
                  <div>  --verify    Verify attestation</div>
                  <div>  --keys      Show public keys</div>
                  <div>  --status    Show system status</div>
                </div>
                <div className="text-green-400 mt-4">$ _</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">System Logs</h3>
            </div>
            <div className="p-6">
              <div className="bg-black rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
                <div className="text-gray-500">[2025-01-14 22:15:32] INFO: OAA Core started successfully</div>
                <div className="text-gray-500">[2025-01-14 22:15:33] INFO: PAL Engine initialized with v2.1.0</div>
                <div className="text-gray-500">[2025-01-14 22:15:34] INFO: Zeus Gateway loaded quality gates</div>
                <div className="text-gray-500">[2025-01-14 22:15:35] INFO: Echo Bridge connected to sentinel</div>
                <div className="text-gray-500">[2025-01-14 22:15:36] INFO: Health Sentinel monitoring active</div>
                <div className="text-blue-400">[2025-01-14 22:16:01] INFO: Attestation request received</div>
                <div className="text-green-400">[2025-01-14 22:16:02] SUCCESS: Attestation verified and signed</div>
                <div className="text-blue-400">[2025-01-14 22:16:15] INFO: PAL evaluation completed</div>
                <div className="text-yellow-400">[2025-01-14 22:16:16] WARN: Canary traffic at 25%</div>
                <div className="text-green-400">[2025-01-14 22:16:30] SUCCESS: Zeus gate passed - ready for promotion</div>
              </div>
            </div>
          </div>
        )}
    </main>
    </div>
  );
}
