const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const socketIo = require('socket.io');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const config = require('./config');
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || "127.0.0.1"; // 0.0.0.0 on Render

mongoose.connect(process.env.MONGO_URI || config.db)
  .then(() => console.log('Connection successful!'))
  .catch((err) => console.error(err));

let router = require('./router');

var app = express();

var customContentTypeMiddleware = process.env.FRONTEND_URL || '';

const allowedOrigins = [
  'http://localhost:5173',
   'https://pwa-frontend.vercel.app',
].filter(Boolean);

const isAllowedOrigin = (origin) =>
  !origin || allowedOrigins.includes(origin);

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
