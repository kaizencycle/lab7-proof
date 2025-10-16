'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Send, Paperclip, Bot, User, Settings, Zap, Shield, FileText, 
  Menu, X, Search, Plus, MessageSquare, FolderOpen, 
  ChevronDown, ChevronRight, MoreHorizontal, Star, 
  History, Code, Database, Server, Key, Activity,
  Play, Pause, Square, RotateCcw, Download, Upload
} from 'lucide-react';

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
  const [activePanel, setActivePanel] = useState<'chat' | 'files' | 'search'>('chat');
  const [chatHistory, setChatHistory] = useState([
    { id: '1', title: 'New Chat', timestamp: new Date(), messages: 1 },
    { id: '2', title: 'System Status Check', timestamp: new Date(Date.now() - 3600000), messages: 3 },
    { id: '3', title: 'Attestation Help', timestamp: new Date(Date.now() - 7200000), messages: 5 }
  ]);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['root', 'services', 'scripts']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fileTree = [
    {
      name: 'OAA Project',
      type: 'folder',
      id: 'root',
      children: [
        {
          name: 'services',
          type: 'folder',
          id: 'services',
          children: [
            { name: 'oaa-core.py', type: 'file', id: 'oaa-core', language: 'python' },
            { name: 'pal-engine.py', type: 'file', id: 'pal-engine', language: 'python' },
            { name: 'zeus-gateway.py', type: 'file', id: 'zeus-gateway', language: 'python' }
          ]
        },
        {
          name: 'scripts',
          type: 'folder',
          id: 'scripts',
          children: [
            { name: 'auto_merge_edits.py', type: 'file', id: 'auto-merge', language: 'python' },
            { name: 'pal_eval.py', type: 'file', id: 'pal-eval', language: 'python' },
            { name: 'canary_bump.py', type: 'file', id: 'canary-bump', language: 'python' }
          ]
        },
        {
          name: 'docs',
          type: 'folder',
          id: 'docs',
          children: [
            { name: 'api', type: 'folder', id: 'api', children: [
              { name: 'rollout.json', type: 'file', id: 'rollout-json', language: 'json' },
              { name: 'safety.json', type: 'file', id: 'safety-json', language: 'json' }
            ]},
            { name: 'badges', type: 'folder', id: 'badges', children: [
              { name: 'pal_rollout.svg', type: 'file', id: 'pal-rollout-svg', language: 'svg' },
              { name: 'pal_safety.svg', type: 'file', id: 'pal-safety-svg', language: 'svg' }
            ]}
          ]
        },
        { name: 'README.md', type: 'file', id: 'readme', language: 'markdown' },
        { name: 'package.json', type: 'file', id: 'package', language: 'json' }
      ]
    }
  ];

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

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const getFileIcon = (file: any) => {
    if (file.type === 'folder') return <FolderOpen size={16} />;
    switch (file.language) {
      case 'python': return <Code size={16} className="text-yellow-400" />;
      case 'json': return <Database size={16} className="text-orange-400" />;
      case 'markdown': return <FileText size={16} className="text-blue-400" />;
      case 'svg': return <FileText size={16} className="text-purple-400" />;
      default: return <FileText size={16} className="text-gray-400" />;
    }
  };

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <div 
          className={`flex items-center py-1 px-2 rounded hover:bg-gray-700/50 cursor-pointer text-sm file-item ${
            level > 0 ? `ml-${level * 4}` : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => item.type === 'folder' ? toggleFolder(item.id) : null}
        >
          {item.type === 'folder' ? (
            expandedFolders.includes(item.id) ? 
              <ChevronDown size={14} className="mr-1 text-gray-400" /> : 
              <ChevronRight size={14} className="mr-1 text-gray-400" />
          ) : (
            <div className="w-3 mr-1" />
          )}
          {getFileIcon(item)}
          <span className="ml-2 text-gray-300">{item.name}</span>
        </div>
        {item.type === 'folder' && expandedFolders.includes(item.id) && item.children && (
          <div>
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
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
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">OAA</span>
            </div>
            <span className="font-semibold text-sm">OAA Assistant</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-700 rounded px-2 py-1">
            <Search size={14} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search files, messages..." 
              className="bg-transparent text-sm text-gray-300 placeholder-gray-400 focus:outline-none w-48"
            />
          </div>
          <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col mt-12">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActivePanel('chat')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === 'chat' 
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare size={16} className="inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => setActivePanel('files')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === 'files' 
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FolderOpen size={16} className="inline mr-2" />
              Files
            </button>
            <button
              onClick={() => setActivePanel('search')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activePanel === 'search' 
                  ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search size={16} className="inline mr-2" />
              Search
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {activePanel === 'chat' && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-300">Recent Chats</h3>
                  <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-1">
                  {chatHistory.map((chat) => (
                    <div key={chat.id} className="p-2 rounded hover:bg-gray-700/50 cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 truncate">{chat.title}</span>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(chat.timestamp)} • {chat.messages} messages
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Quick Actions</h3>
                  <div className="space-y-1">
                    <button 
                      onClick={() => setInputValue('Check system status')}
                      className="w-full text-left p-2 rounded hover:bg-gray-700/50 transition-colors text-sm flex items-center space-x-2"
                    >
                      <Activity size={16} className="text-green-400" />
                      <span>System Status</span>
                    </button>
                    <button 
                      onClick={() => setInputValue('Create attestation')}
                      className="w-full text-left p-2 rounded hover:bg-gray-700/50 transition-colors text-sm flex items-center space-x-2"
                    >
                      <Shield size={16} className="text-blue-400" />
                      <span>Create Attestation</span>
                    </button>
                    <button 
                      onClick={() => setInputValue('View public keys')}
                      className="w-full text-left p-2 rounded hover:bg-gray-700/50 transition-colors text-sm flex items-center space-x-2"
                    >
                      <Key size={16} className="text-purple-400" />
                      <span>Public Keys</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Services</h3>
                  <div className="space-y-1">
                    {status.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-700/30">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            service.status === 'running' ? 'bg-green-400' : 'bg-red-400'
                          }`}></div>
                          <span className="text-sm text-gray-300">{service.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">v{service.version}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePanel === 'files' && (
              <div className="p-2">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-sm font-semibold text-gray-300">Explorer</h3>
                  <div className="flex space-x-1">
                    <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                      <Plus size={14} />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-xs">
                  {renderFileTree(fileTree)}
                </div>
              </div>
            )}

            {activePanel === 'search' && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Search</h3>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Search in files..." 
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center space-x-2 mb-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Include file contents</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Case sensitive</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col mt-12">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-scroll">
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
        <div className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-end space-x-3 max-w-4xl mx-auto">
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Paperclip size={20} />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about attestations, system status, or OAA operations..."
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 input-focus backdrop-blur-sm input-enhanced focus-ring"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  Press Enter to send
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl transition-colors btn-hover cursor-btn"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
