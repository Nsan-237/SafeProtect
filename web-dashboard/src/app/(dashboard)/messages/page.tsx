"use client";

import { useState } from 'react';
import { mockThreads, mockMessages } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare, ShieldAlert } from 'lucide-react';

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState(mockThreads[0]);
  const [newMessage, setNewMessage] = useState('');
  const [messagesList, setMessagesList] = useState(mockMessages);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessagesList([
      ...messagesList,
      {
        id: `MSG-${Date.now()}`,
        threadId: selectedThread.id,
        senderName: 'You',
        isSender: true,
        content: newMessage,
        timestamp: 'Just now'
      }
    ]);
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Secure Messages</h1>
        <p className="text-gray-500 text-sm">Encrypted communication channel with social workers, victims, and medical staff.</p>
      </div>

      <Card className="grid md:grid-cols-3 min-h-[500px] overflow-hidden">
        <div className="border-r border-gray-200 p-4 space-y-3 bg-gray-50/50">
          <h3 className="font-semibold text-sm text-gray-700 px-2">Conversations</h3>
          <div className="space-y-1">
            {mockThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedThread.id === thread.id
                    ? 'bg-[#5B3FD3] text-white shadow-sm'
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-sm">{thread.senderName}</div>
                  <span className={`text-xs ${selectedThread.id === thread.id ? 'text-white/80' : 'text-gray-400'}`}>
                    {thread.timestamp}
                  </span>
                </div>
                <div className={`text-xs truncate ${selectedThread.id === thread.id ? 'text-white/90' : 'text-gray-500'}`}>
                  {thread.lastMessage}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col h-full justify-between p-6 bg-white">
          <div className="border-b pb-3 mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">{selectedThread.senderName}</h3>
              <p className="text-xs text-gray-500">{selectedThread.senderRole}</p>
            </div>
            <div className="text-xs bg-purple-50 text-[#5B3FD3] px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" /> End-to-End Encrypted
            </div>
          </div>

          <div className="space-y-4 mb-4 flex-1 overflow-y-auto max-h-[350px] pr-2">
            {messagesList.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-sm ${
                    msg.isSender
                      ? 'bg-[#5B3FD3] text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className={`text-[10px] block mt-1 ${msg.isSender ? 'text-white/70 text-right' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t pt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a secure message..."
              className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B3FD3]"
            />
            <Button onClick={handleSend} className="bg-[#5B3FD3] hover:bg-[#4c33b8]">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
