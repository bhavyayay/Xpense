import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import goalRoutes from './routes/goals';
import transactionRoutes from './routes/transactions';
import challengeRoutes from './routes/challenges';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'XPense API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'XPense Financial Wellness API',
    status: 'Active',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Get profile'
      },
      goals: {
        'GET /api/goals': 'Get user goals',
        'POST /api/goals': 'Create goal',
        'PUT /api/goals/:id/progress': 'Update progress'
      },
      transactions: {
        'GET /api/transactions': 'Get transactions',
        'POST /api/transactions': 'Add transaction'
      },
      challenges: {
        'GET /api/challenges/available': 'Get challenges',
        'POST /api/challenges/seed': 'Seed sample challenges'
      },
      dashboard: {
        'GET /api/dashboard': 'Get dashboard data'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Check for required environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 XPense API running on http://localhost:${PORT}`);
      console.log(`🎮 Features: Auth, Goals, Transactions, Challenges, Dashboard`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();