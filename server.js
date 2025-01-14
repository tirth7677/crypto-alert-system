const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const priceRoutes = require('./routes/price.routes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Register price routes
app.use('/api/v1/prices', priceRoutes);

// Enhanced health check route
app.get('/', (req, res) => {
    const healthDetails = {
        status: 'Server is up and running!',
        uptime: `${process.uptime().toFixed(2)} seconds`,
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    };
    res.status(200).json(healthDetails);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});