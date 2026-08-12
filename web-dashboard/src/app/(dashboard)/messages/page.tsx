"use client";

import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare, ShieldAlert } from 'lucide-react';

export default function MessagesPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('@user') || '{}');
      setCurrentUser(user);
    } catch (e) {}
  }, []);

  const loadThreads = useCallback(async () => {
    try {
      setError('');
      const response = await api.get('/messages/threads');
      
      // Group logic if needed, assuming the API returns valid thread objects or an array of messages to group
      // The prompt says: "Fetch threads from GET /messages/threads and group messages by the other user..."
      // Assuming response.data is an array of messages or already grouped threads.
      // We will assume it returns threads or latest messages per thread.
      const rawThreads = response.data || [];
      const grouped = new Map();
      
      rawThreads.forEach((msg: any) => {
        const otherUser = msg.senderId === currentUser?.id ? msg.receiver : msg.sender;
        if (otherUser && !grouped.has(otherUser.id)) {
          grouped.set(otherUser.id, {
            id: otherUser.id,
            user: otherUser,
            lastMessage: msg.content,
            timestamp: msg.createdAt
          });
        }
      });
      
      const threadArray = Array.from(grouped.values());
      setThreads(threadArray);
      if (threadArray.length > 0 && !selectedThread) {
        setSelectedThread(threadArray[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load threads.');
    } finally {
      setLoading(false);
    }
  }, [currentUser, selectedThread]);

  useEffect(() => { 
    if (currentUser?.id) {
      loadThreads(); 
    }
  }, [loadThreads, currentUser]);

  const loadMessages = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessagesList(response.data || []);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  }, []);

  useEffect(() => {
    if (selectedThread?.id) {
      loadMessages(selectedThread.id);
    }
  }, [selectedThread, loadMessages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedThread) return;
    
    try {
      const res = await api.post('/messages', {
        receiverId: selectedThread.id,
        content: newMessage
      });
      
      setMessagesList((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  if (loading && !threads.length) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Secure Messages</h1>
        <p className="text-gray-500 text-sm">Encrypted communication channel with social workers, victims, and medical staff.</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <Card className="grid md:grid-cols-3 min-h-[500px] overflow-hidden">
        <div className="border-r border-gray-200 p-4 space-y-3 bg-gray-50/50">
          <h3 className="font-semibold text-sm text-gray-700 px-2">Conversations</h3>
          <div className="space-y-1">
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedThread?.id === thread.id
                    ? 'bg-[#5B3FD3] text-white shadow-sm'
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-sm">{thread.user?.name || 'Unknown'}</div>
                  <span className={`text-xs ${selectedThread?.id === thread.id ? 'text-white/80' : 'text-gray-400'}`}>
                    {thread.timestamp ? new Date(thread.timestamp).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className={`text-xs truncate ${selectedThread?.id === thread.id ? 'text-white/90' : 'text-gray-500'}`}>
                  {thread.lastMessage}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col h-full justify-between p-6 bg-white">
          {selectedThread ? (
            <>
              <div className="border-b pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{selectedThread.user?.name}</h3>
                  <p className="text-xs text-gray-500">{selectedThread.user?.role}</p>
                </div>
                <div className="text-xs bg-purple-50 text-[#5B3FD3] px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" /> End-to-End Encrypted
                </div>
              </div>

              <div className="space-y-4 mb-4 flex-1 overflow-y-auto max-h-[350px] pr-2">
                {messagesList.map((msg) => {
                  const isSender = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-sm ${
                          isSender
                            ? 'bg-[#5B3FD3] text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span className={`text-[10px] block mt-1 ${isSender ? 'text-white/70 text-right' : 'text-gray-400'}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
