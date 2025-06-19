'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
// import axios from 'axios'; // You'll need to install: npm install axios
import { useSession } from 'next-auth/react';
// import { io, Socket } from 'socket.io-client'; // You'll need to install socket.io-client
import { 
  Send, 
  Smile,  
  MoreVertical,  
  ArrowLeft,
  CheckCheck,
  Check,
  Clock,
  User,
  Loader2
} from 'lucide-react';

// Mock toast for demo - replace with react-hot-toast
const toast = {
  success: (message: string) => console.log('SUCCESS:', message),
  error: (message: string) => console.log('ERROR:', message),
  loading: (message: string) => console.log('LOADING:', message),
};

interface Sender {
  _id: string;
  username: string;
}

interface Message {
  _id: string;
  message: string;
  senderId: Sender;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export default function ChatRoomPage() {
  const params = useParams();
  const chatId = Array.isArray(params?.chatId) ? params.chatId[0] : params?.chatId;
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState<'online' | 'offline' | 'away'>('offline');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<any>(null); // Replace with proper Socket type

  // Mock emojis for demo
  const commonEmojis = ['😀', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🎉', '🔥', '💯'];

  // Fetch chat data
  useEffect(() => {
    const fetchChatData = async () => {
      setLoading(true);
      toast.loading('Loading chat...');
      
      try {
        // Replace with your actual API calls
        const messagesResponse = await fetch(`/api/chat/${chatId}/messages`);
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);

        const chatInfoResponse = await fetch(`/api/chat/${chatId}/info`);
        const chatInfoData = await chatInfoResponse.json();
        setClientId(chatInfoData.clientId);
        setFreelancerId(chatInfoData.freelancerId);
        
        toast.success('Chat loaded successfully!');
      } catch (error) {
        console.error('Failed to load chat data:', error);
        toast.error('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    if (chatId) fetchChatData();
  }, [chatId]);

  // Setup socket connection
  useEffect(() => {
    if (!chatId) return;

    // Mock socket setup - replace with actual socket.io
    // socketRef.current = io({ path: '/api/socket', query: { roomId: chatId } });
    // const socket = socketRef.current;
    // socket.emit('joinRoom', chatId);
    // socket.on('newMessage', (msg: Message) => {
    //   setMessages((prev) => [...prev, msg]);
    // });
    // socket.on('typing', () => setIsTyping(true));
    // socket.on('stopTyping', () => setIsTyping(false));
    // socket.on('userOnline', () => setOnlineStatus('online'));
    // socket.on('userOffline', () => setOnlineStatus('offline'));

    // Cleanup
    return () => {
      // socket?.off('newMessage');
      // socket?.disconnect();
    };
  }, [chatId]);

  // Auto scroll to bottom
  useEffect(() => {
    if (!loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !session) return;

    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      message: newMessage,
      senderId: { _id: session.user?.id || '', username: session.user?.name || '' },
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    // Add message optimistically
    setMessages(prev => [...prev, tempMessage]);
    const messageText = newMessage;
    setNewMessage('');
    setSending(true);

    try {
      const response = await fetch(`/api/chat/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          type: 'text',
          attachmentUrl: null,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const savedMessage: Message = await response.json();
      
      // Replace temp message with saved message
      setMessages(prev => 
        prev.map(msg => msg._id === tempMessage._id ? 
          { ...savedMessage, status: 'sent' } : msg
        )
      );

      // Emit to socket
      // socketRef.current?.emit('message', savedMessage);
      
      toast.success('Message sent!');
    } catch (error) {
      console.error('Message send error:', error);
      toast.error('Failed to send message');
      
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
      setNewMessage(messageText); // Restore message text
    } finally {
      setSending(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    // socketRef.current?.emit('typing');
    // Debounce stop typing
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-purple-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!session || !clientId || !freelancerId) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">You must be logged in to view the chat.</p>
        </div>
      </div>
    );
  }

  const currentUserId = session.user?.id;
  const currentUserRole = currentUserId === clientId ? 'client' : 'freelancer';
  const otherUser = currentUserRole === 'client' ? 'Freelancer' : 'Client';

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-700 border-b border-gray-600 p-4 flex items-center justify-between animate-slide-down">
        <div className="flex items-center space-x-4">
          <button className="lg:hidden p-2 hover:bg-gray-600 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-700 ${
                onlineStatus === 'online' ? 'bg-green-500' : 
                onlineStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
            </div>
            
            <div>
              <h1 className="font-semibold text-lg">Project Chat</h1>
              <p className="text-sm text-gray-400">
                with {otherUser} • {onlineStatus === 'online' ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
         
          <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
            <MoreVertical size={20} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <Send size={24} className="text-gray-400" />
            </div>
            <p className="text-xl text-gray-400 mb-2">No messages yet</p>
            <p className="text-gray-500">Start the conversation with a greeting!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isOwn = currentUserRole === 'client' 
                ? msg.senderId._id === clientId 
                : msg.senderId._id === freelancerId;
              
              const showAvatar = index === 0 || 
                messages[index - 1].senderId._id !== msg.senderId._id;
              
              const showTimestamp = index === messages.length - 1 || 
                new Date(messages[index + 1].timestamp).getTime() - new Date(msg.timestamp).getTime() > 300000;

              return (
                <div
                  key={msg._id}
                  className={`flex items-end space-x-2 animate-message-in ${
                    isOwn ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 ${
                    showAvatar ? 'visible' : 'invisible'
                  }`}>
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-xs font-medium ${
                      isOwn ? 'bg-purple-500' : 'bg-gray-600'
                    }`}>
                      {msg.senderId.username.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Message */}
                  <div className={`max-w-xs lg:max-w-md ${isOwn ? 'mr-2' : 'ml-2'}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-lg ${
                        isOwn
                          ? 'bg-purple-500 text-white rounded-br-md'
                          : 'bg-gray-700 text-gray-100 rounded-bl-md'
                      } hover:shadow-xl transition-shadow duration-200`}
                    >
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>

                    {/* Message info */}
                    <div className={`flex items-center mt-1 space-x-1 text-xs text-gray-500 ${
                      isOwn ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                      
                      {isOwn && (
                        <div className="flex items-center">
                          {msg.status === 'sending' && <Clock size={12} className="text-gray-400" />}
                          {msg.status === 'sent' && <Check size={12} className="text-gray-400" />}
                          {msg.status === 'delivered' && <CheckCheck size={12} className="text-gray-400" />}
                          {msg.status === 'read' && <CheckCheck size={12} className="text-purple-400" />}
                        </div>
                      )}
                    </div>

                    {showTimestamp && (
                      <div className="text-center mt-4 mb-2">
                        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                          {new Date(msg.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center space-x-2 animate-pulse">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <div className="bg-gray-700 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-gray-700 border-t border-gray-600 p-4">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg animate-slide-up">
            <div className="grid grid-cols-10 gap-2">
              {commonEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => addEmoji(emoji)}
                  className="text-xl hover:bg-gray-700 rounded p-1 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end space-x-2">
          {/* Emoji Button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showEmojiPicker ? 'bg-purple-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            <Smile size={20} />
          </button>

          {/* Attachment Button */}
          

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Type your message..."
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={sending}
            />
            {sending && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="animate-spin h-4 w-4 text-purple-500" />
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 hover:scale-105 transform"
          >
            <Send size={20} />
          </button>
        </div>
      </footer>

      <style jsx>{`
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes message-in {
          from { 
            opacity: 0; 
            transform: translateY(10px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-message-in {
          animation: message-in 0.4s ease-out;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 9999px;
        }
        
        .scrollbar-track-gray-800::-webkit-scrollbar-track {
          background-color: #1f2937;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>
    </div>
  );
}