const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const mockRoutes = require('./routes/mocks');
const endpointRoutes = require('./routes/endpoints');
const executeRoutes = require('./routes/execute');

const errorHandler = require('./middleware/errorHandler');
const { setupSwagger } = require('./utils/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic midedleware setup
// Configurar Swagger ANTES de helmet
setupSwagger(app);

app.use(helmet({
    contentSecurityPolicy: false, // Deshabilitar CSP para que Swagger funcione
}));
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/endpoints', endpointRoutes);
app.use('/mock', executeRoutes);

app.use(errorHandler);

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Not Found',
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger is available at http://localhost:${PORT}/api-docs`);
    console.log(`Health check endpoint is available at http://localhost:${PORT}/health`);
});

