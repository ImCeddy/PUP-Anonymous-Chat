const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Environment configuration
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') :
  (NODE_ENV === 'production' ? ['https://yourdomain.com'] : ["http://localhost:3000", "http://localhost:5173"]);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connections: userConnections.size,
    activeRooms: activeRooms.size,
    queueLength: searchQueue.length
  });
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Queue for searching users
let searchQueue = [];
const activeRooms = new Set();
const userConnections = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  userConnections.set(socket.id, { connectedAt: Date.now() });

  socket.on('search', () => {
    try {
      console.log('User searching:', socket.id);
      
      // Prevent multiple searches from same user
      if (searchQueue.includes(socket.id)) {
        socket.emit('error', { message: 'Already searching' });
        return;
      }

      if (searchQueue.length > 0) {
        // Pair with existing user
        const partner = searchQueue.shift();
        
        // Verify partner is still connected
        if (!userConnections.has(partner)) {
          // Partner disconnected, try again
          searchQueue.push(socket.id);
          return;
        }

        const room = `room_${socket.id}_${partner}`;
        
        socket.join(room);
        io.sockets.sockets.get(partner)?.join(room);
        
        activeRooms.add(room);
        
        // Notify both users
        io.to(room).emit('matched', { room });
      } else {
        // Add to queue
        searchQueue.push(socket.id);
      }
    } catch (error) {
      console.error('Search error:', error);
      socket.emit('error', { message: 'Search failed' });
    }
  });

  socket.on('message', (data) => {
    try {
      // Input validation
      if (!data || typeof data.text !== 'string' || !data.room) {
        socket.emit('error', { message: 'Invalid message data' });
        return;
      }

      const message = data.text.trim();
      if (message.length === 0 || message.length > 500) {
        socket.emit('error', { message: 'Message length invalid' });
        return;
      }

      // Verify user is in the room
      if (!activeRooms.has(data.room) || !socket.rooms.has(data.room)) {
        socket.emit('error', { message: 'Not in room' });
        return;
      }

      // Broadcast message to room
      socket.to(data.room).emit('message', {
        text: message,
        sender: 'stranger',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('extend_time', (data) => {
    try {
      if (!data || !data.room) {
        socket.emit('error', { message: 'Invalid room data' });
        return;
      }

      // Verify user is in the room
      if (!activeRooms.has(data.room) || !socket.rooms.has(data.room)) {
        socket.emit('error', { message: 'Not in room' });
        return;
      }

      // Broadcast time extension to room
      socket.to(data.room).emit('time_extended');
    } catch (error) {
      console.error('Extend time error:', error);
      socket.emit('error', { message: 'Failed to extend time' });
    }
  });

  socket.on('leave', (data) => {
    try {
      if (data && data.room) {
        socket.to(data.room).emit('partner_left');
        socket.leave(data.room);
        activeRooms.delete(data.room);
      }
    } catch (error) {
      console.error('Leave error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove from queue if present
    searchQueue = searchQueue.filter(id => id !== socket.id);
    userConnections.delete(socket.id);
    
    // Clean up empty rooms
    activeRooms.forEach(room => {
      const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
      if (roomSize === 0) {
        activeRooms.delete(room);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});