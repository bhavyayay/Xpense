"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const goals_1 = __importDefault(require("./routes/goals"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const challenges_1 = __importDefault(require("./routes/challenges"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/goals', goals_1.default);
app.use('/api/transactions', transactions_1.default);
app.use('/api/challenges', challenges_1.default);
app.use('/api/dashboard', dashboard_1.default);
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'XPense Financial Wellness API',
        status: 'Active',
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
// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 XPense API running on http://localhost:${PORT}`);
            console.log(`🎮 Features: Auth, Goals, Transactions, Challenges, Dashboard`);
        });
    }
    catch (error) {
        console.error('❌ Error starting server:', error);
    }
};
startServer();
//# sourceMappingURL=index.js.map