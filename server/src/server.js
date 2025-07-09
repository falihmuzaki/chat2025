const express = require('express');
const mongoose = require('mongoose');
const chatRoutes = require('./chat');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/messages', chatRoutes);

// MongoDB connection
// MongoDB connection
mongoose.connect('mongodb://mongo:SeJheWDtvUHOgRfDotjZUmAFfNBndONx@interchange.proxy.rlwy.net:25391', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));


// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Chat API is running!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal Server Error' 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
