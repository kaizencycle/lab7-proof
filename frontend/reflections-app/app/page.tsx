'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Bot, User, Settings, Zap, Shield, FileText } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  type?: 'text' | 'attestation' | 'status' | 'error';
  metadata?: any;
}

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your OAA Assistant. I can help you with attestations, verify credentials, check system status, and manage your Open Attestation Authority. How can I assist you today?',
      role: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState<OAAStatus>({
    status: 'loading',
    services: []
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
        type: response.type,
        metadata: response.metadata
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateResponse = (input: string): { content: string; type: 'text' | 'attestation' | 'status' | 'error'; metadata?: any } => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('status') || lowerInput.includes('health')) {
      return {
        content: 'Here\'s the current system status:',
        type: 'status',
        metadata: status
      };
    }

    if (lowerInput.includes('attest') || lowerInput.includes('verify')) {
      return {
        content: 'I can help you create and verify attestations. Please provide the data you want to attest, and I\'ll process it through the OAA Core engine.',
        type: 'attestation',
        metadata: { action: 'create_attestation' }
      };
    }

    if (lowerInput.includes('help') || lowerInput.includes('commands')) {
      return {
        content: 'Here are the available commands:\n\n• **Status** - Check system health and service status\n• **Attest** - Create or verify digital attestations\n• **Keys** - View public keys for verification\n• **Logs** - Access system logs and monitoring\n• **PAL** - Policy as Learning operations\n• **Zeus** - Quality gate management\n\nYou can also ask me about specific services or request detailed information about any OAA functionality.',
        type: 'text'
      };
    }

    if (lowerInput.includes('pal') || lowerInput.includes('policy')) {
      return {
        content: 'The PAL (Policy as Learning) Engine is currently running with adaptive learning policies. It\'s monitoring canary rollouts and maintaining safety gates. Would you like me to show you the current policy status or help with a specific PAL operation?',
        type: 'text'
      };
    }

    if (lowerInput.includes('zeus') || lowerInput.includes('gate')) {
      return {
        content: 'Zeus Gateway is active and monitoring quality gates. All services have passed the current safety checks. The system is ready for production traffic.',
        type: 'text'
      };
    }

    // Default response
    return {
      content: 'I understand you\'re asking about: "' + input + '". I can help you with OAA operations, attestations, system monitoring, and policy management. Could you be more specific about what you\'d like to do?',
      type: 'text'
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-blue-600' 
              : message.role === 'system' 
                ? 'bg-gray-600' 
                : 'bg-gradient-to-br from-purple-500 to-blue-600'
          }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>

          {/* Message Content */}
          <div className={`rounded-2xl px-4 py-3 message-bubble message-enter ${
            isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-100 border border-gray-700'
          }`}>
            <div className="whitespace-pre-wrap">{message.content}</div>
            <div className={`text-xs mt-2 ${
              isUser ? 'text-blue-100' : 'text-gray-400'
            }`}>
              {formatTime(message.timestamp)}
            </div>

            {/* Special message types */}
            {message.type === 'status' && message.metadata && (
              <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                <div className="text-sm font-semibold mb-2">System Status</div>
                <div className="space-y-1 text-xs">
                  {message.metadata.services?.map((service: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span>{service.name}</span>
                      <span className={service.status === 'running' ? 'text-green-400' : 'text-red-400'}>
                        {service.status} (v{service.version})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {message.type === 'attestation' && (
              <div className="mt-3 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                <div className="text-sm font-semibold mb-2 flex items-center">
                  <Shield size={16} className="mr-2" />
                  Attestation Ready
                </div>
                <div className="text-xs text-gray-300">
                  Provide your data and I'll create a cryptographically signed attestation.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OAA</span>
              </div>
              <div>
                <h2 className="font-semibold">OAA Assistant</h2>
                <p className="text-xs text-gray-400">Open Attestation Authority</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setInputValue('Check system status')}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-2"
              >
                <Zap size={16} />
                <span>System Status</span>
              </button>
              <button 
                onClick={() => setInputValue('Create attestation')}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-2"
              >
                <Shield size={16} />
                <span>Create Attestation</span>
              </button>
              <button 
                onClick={() => setInputValue('View public keys')}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-2"
              >
                <FileText size={16} />
                <span>Public Keys</span>
              </button>
            </div>
          </div>

          {/* Services Status */}
          <div className="p-4 flex-1">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Services</h3>
            <div className="space-y-2">
              {status.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'running' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-sm">{service.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">v{service.version}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="p-4 border-t border-gray-700">
            <button className="w-full text-left p-2 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-2">
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings size={20} />
            </button>
            <div>
              <h1 className="font-semibold">OAA Assistant</h1>
              <p className="text-sm text-gray-400">
                {status.status === 'online' ? 'Online' : 'Connecting...'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              status.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
            <span className="text-sm text-gray-400">
              {status.status === 'online' ? 'All systems operational' : 'Initializing...'}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll">
          {messages.map(renderMessage)}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-end space-x-3">
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Paperclip size={20} />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about attestations, system status, or OAA operations..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 input-focus"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors btn-hover"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
