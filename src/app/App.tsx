import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { LandingPage } from './components/LandingPage';
import { SearchingScreen } from './components/SearchingScreen';
import { ChatInterface } from './components/ChatInterface';

type AppState = 'landing' | 'searching' | 'chatting';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [socket, setSocket] = useState<any>(null);
  const [room, setRoom] = useState<string>('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Add a timeout to ensure we don't get stuck in connecting state
    const connectionTimeout = setTimeout(() => {
      if (isConnecting) {
        console.warn('Connection timeout - showing app anyway');
        setIsConnecting(false);
        setConnectionError('Connection timeout. You can still use the app, but real-time features may not work.');
      }
    }, 10000); // 10 second timeout

    setIsConnecting(true);
    try {
      const newSocket = io('https://pup-anonymous-chat-production.up.railway.app', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        clearTimeout(connectionTimeout);
        setConnectionError(null);
        setIsConnecting(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        clearTimeout(connectionTimeout);
        setConnectionError('Failed to connect to server. You can still browse the app, but chat features may not work.');
        setIsConnecting(false);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          newSocket.connect();
        }
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected after', attemptNumber, 'attempts');
        setConnectionError(null);
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('Reconnection failed:', error);
        setConnectionError('Lost connection. Trying to reconnect...');
      });

      setSocket(newSocket);

      return () => {
        clearTimeout(connectionTimeout);
        newSocket.close();
      };
    } catch (error) {
      console.error('Socket initialization error:', error);
      clearTimeout(connectionTimeout);
      setConnectionError('Failed to initialize connection. You can still browse the app.');
      setIsConnecting(false);
    }
  }, []);

  const handleStartSearch = () => {
    if (!socket || !socket.connected) {
      setConnectionError('Not connected to server. Please wait for reconnection.');
      return;
    }

    setAppState('searching');
    setConnectionError(null);

    if (socket) {
      socket.emit('search');
      socket.on('matched', (data: { room: string }) => {
        setRoom(data.room);
        setAppState('chatting');
      });

      // Handle search timeout
      const searchTimeout = setTimeout(() => {
        if (appState === 'searching') {
          setConnectionError('No partners found. Please try again.');
          setAppState('landing');
        }
      }, 30000); // 30 second timeout

      // Clean up timeout when matched
      socket.once('matched', () => {
        clearTimeout(searchTimeout);
      });
    }
  };

  const handleLeaveChat = () => {
    if (socket && room) {
      socket.emit('leave', { room });
    }
    setAppState('landing');
    setRoom('');
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Connection Status */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              socket?.connected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="text-xs text-gray-600">
            {isConnecting ? 'Connecting...' : socket?.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {connectionError && (
        <div className="fixed top-16 right-4 z-50 max-w-sm">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-sm">
            <p className="text-sm text-red-800">{connectionError}</p>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {isConnecting && !socket && (
        <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Connecting to server...</h2>
            <p className="text-gray-500">Please wait while we establish connection</p>
          </div>
        </div>
      )}

      {/* Main App Content */}
      {!isConnecting || socket ? (
        <>
          {appState === 'landing' && (
            <LandingPage onStartSearch={handleStartSearch} />
          )}
          {appState === 'searching' && (
            <SearchingScreen />
          )}
          {appState === 'chatting' && (
            <ChatInterface socket={socket} room={room} onLeaveChat={handleLeaveChat} />
          )}
        </>
      ) : (
        /* Fallback for when socket is not available but not connecting */
        <LandingPage onStartSearch={handleStartSearch} />
      )}
    </div>
  );
}