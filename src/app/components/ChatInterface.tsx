import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Send, Heart, LogOut, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { censorMessage, containsProhibitedWords } from '../../utils/profanityFilter';
import { Footer } from './Footer';
import logoImage from '../../assets/Logo_Anonymous.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'stranger';
  timestamp: Date;
}

interface ChatInterfaceProps {
  socket: any;
  room: string;
  onLeaveChat: () => void;
}

export const ChatInterface = memo(function ChatInterface({ socket, room, onLeaveChat }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        setConnectionStatus('connected');
      });

      socket.on('disconnect', () => {
        setConnectionStatus('disconnected');
      });

      socket.on('reconnect', () => {
        setConnectionStatus('connected');
      });

      socket.on('message', (msg: { text: string; sender: string; timestamp: string }) => {
        try {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              text: msg.text,
              sender: 'stranger' as const,
              timestamp: new Date(msg.timestamp),
            },
          ]);
        } catch (error) {
          console.error('Error handling message:', error);
        }
      });

      socket.on('time_extended', () => {
        setCountdown(prev => prev + 60);
        setNotification('Your partner extended the time!');
        setTimeout(() => setNotification(null), 3000);
      });

      socket.on('partner_left', () => {
        setIsDisconnecting(true);
        setTimeout(() => {
          onLeaveChat();
        }, 5000);
      });

      // Handle connection errors
      socket.on('connect_error', (error: Error) => {
        console.error('Socket connection error:', error);
        setConnectionStatus('disconnected');
      });

      // Handle server errors
      socket.on('error', (error: { message: string }) => {
        console.error('Server error:', error);
        setNotification(`Error: ${error.message}`);
        setTimeout(() => setNotification(null), 5000);
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('reconnect');
        socket.off('message');
        socket.off('time_extended');
        socket.off('partner_left');
        socket.off('connect_error');
      }
    };
  }, [socket, onLeaveChat]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsDisconnecting(true);
          setTimeout(() => {
            onLeaveChat();
          }, 5000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [onLeaveChat]);

  // Handle staying connected
  const handleStayConnected = useCallback(() => {
    setCountdown(prev => prev + 60);
    if (socket && room) {
      socket.emit('extend_time', { room });
    }
  }, [socket, room]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isSending || !socket || !room) return;

    // Input validation
    const trimmedMessage = inputValue.trim();
    if (trimmedMessage.length > 500) {
      setNotification('Message too long (max 500 characters)');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Check for prohibited words
    if (containsProhibitedWords(trimmedMessage)) {
      setNotification('Message contains inappropriate content and cannot be sent');
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    // Basic sanitization - remove potentially harmful characters
    const sanitizedMessage = trimmedMessage.replace(/[<>]/g, '');

    // Apply censorship (double-check)
    const censoredMessage = censorMessage(sanitizedMessage);

    setIsSending(true);

    try {
      const message: Message = {
        id: Date.now().toString(),
        text: censoredMessage,
        sender: 'user' as const,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, message]);
      socket.emit('message', { text: censoredMessage, room });
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
      setNotification('Failed to send message. Please try again.');
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSending(false);
    }
  }, [inputValue, isSending, socket, room]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  }, [handleSendMessage]);

  const getCountdownColor = () => {
    if (countdown <= 5) return 'text-red-600 border-red-500 bg-red-50';
    if (countdown <= 10) return 'text-orange-600 border-orange-500 bg-orange-50';
    return 'text-green-600 border-green-500 bg-green-50';
  };

  const getButtonStyle = () => {
    if (countdown <= 5) return 'from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 animate-pulse';
    if (countdown <= 10) return 'from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600';
    return 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700';
  };

  if (isDisconnecting) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl">💔</div>
          <h2 className="text-2xl font-semibold text-gray-800">Connection Lost</h2>
          <p className="text-gray-600">You didn't stay active. Returning to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 px-4 md:px-6 py-3 md:py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3">
            <img 
              src={logoImage}
              alt="PUP Logo"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-gray-800 text-sm md:text-base">Connected</h2>
              <p className="text-xs text-gray-500">Anonymous Stranger</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' :
                  connectionStatus === 'reconnecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
              <span className="text-xs text-gray-500 hidden sm:inline">
                {connectionStatus === 'connected' ? 'Online' :
                 connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Offline'}
              </span>
            </div>
            <Button
              onClick={onLeaveChat}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 text-xs md:text-sm"
            >
              <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Leave</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="px-4 md:px-6 py-2">
          <div className="max-w-4xl mx-auto">
            <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-bounce text-center">
              {notification}
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:py-6 pb-48 md:pb-56">
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          {/* Connection message */}
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
            <span>You're now connected with a fellow student</span>
            <Heart className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 md:py-3 rounded-2xl text-sm md:text-base ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-orange-100'
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Bottom Section with Input and Stay Connected Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-orange-100 shadow-lg">
        {/* Stay Connected Section - More Prominent and Accessible */}
        <div className="bg-gradient-to-r from-orange-50 to-rose-50 border-b border-orange-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className={`flex items-center justify-center w-14 h-14 md:w-12 md:h-12 rounded-full border-4 font-bold text-xl transition-colors ${getCountdownColor()}`}>
                  {countdown}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Keep the conversation alive</p>
                  <p className="text-xs text-gray-600">Tap to stay connected</p>
                </div>
              </div>
              
              <Button
                onClick={handleStayConnected}
                className={`bg-gradient-to-r ${getButtonStyle()} text-white px-6 md:px-8 py-6 md:py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-base md:text-lg min-w-[140px] md:min-w-[160px]`}
              >
                <Zap className="w-5 h-5 mr-2" />
                I'm Here!
              </Button>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="px-4 py-3 md:py-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400 text-sm md:text-base h-12"
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isSending || connectionStatus !== 'connected'}
                className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white px-6 md:px-8 h-12 disabled:opacity-50"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';