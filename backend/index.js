const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const { init } = require('./router');
const config = require('./config');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOSTNAME || '0.0.0.0';

// ==================== MongoDB ====================
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI || config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connection successful!'))
.catch(err => console.error('MongoDB connection error:', err));

// ==================== Express ====================
const app = express();

// Middleware para JSON e urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== CORS ====================
const allowedOrigins = [
  process.env.FRONTEND_URL, 'https://pw-class.vercel.app',
  'http://localhost:5173', // desenvolvimento local
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}));

// ==================== HTTP + Socket.io ====================
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Rotas passando io
app.use('/', init(io));

// ==================== Swagger (opcional) ====================
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API PWA',
      version: '1.0.0',
      description: 'Documentação da API',
    },
    servers: [
      { url: `http://localhost:${PORT}` },
    ],
  },
  apis: ['./router.js'],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerOptions)));

// ==================== Socket.io events ====================
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// ==================== Start Server ====================
server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
