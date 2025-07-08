const express = require('express');
const Message = require('./models/Message');

const router = express.Router();

// Validation middleware for POST requests
const validateMessageData = (req, res, next) => {
    console.log('Raw request body:', req.body);
    console.log('Request body keys:', Object.keys(req.body || {}));
    
    // Check if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'Missing request body',
            message: 'Request body is required with username and content fields'
        });
    }

    // Validate required fields - be more flexible with field names
    const { username, content, message } = req.body;
    const actualContent = content || message; // Handle both 'content' and 'message' fields
    
    console.log('Extracted fields:', { username, content, message, actualContent });
    
    if (!username || !actualContent) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'Both username and content are required',
            received: {
                username: !!username,
                content: !!content,
                message: !!message,
                actualContent: !!actualContent
            },
            rawBody: req.body
        });
    }

    // Validate field types
    if (typeof username !== 'string' || typeof actualContent !== 'string') {
        return res.status(400).json({
            error: 'Invalid field types',
            message: 'Username and content must be strings',
            types: {
                username: typeof username,
                content: typeof actualContent
            }
        });
    }

    // Validate field lengths
    if (username.trim().length === 0) {
        return res.status(400).json({
            error: 'Invalid username',
            message: 'Username cannot be empty'
        });
    }

    if (actualContent.trim().length === 0) {
        return res.status(400).json({
            error: 'Invalid content',
            message: 'Message content cannot be empty'
        });
    }

    if (username.length > 50) {
        return res.status(400).json({
            error: 'Username too long',
            message: 'Username must be 50 characters or less'
        });
    }

    if (actualContent.length > 1000) {
        return res.status(400).json({
            error: 'Content too long',
            message: 'Message content must be 1000 characters or less'
        });
    }

    // Sanitize data and normalize field names
    req.body.username = username.trim();
    req.body.content = actualContent.trim();
    
    console.log('Sanitized data:', { username: req.body.username, content: req.body.content });
    
    next();
};

// Get all messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 });
        res.json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ 
            error: 'Database Error',
            message: 'Failed to fetch messages',
            details: error.message 
        });
    }
});

// Send a new message
router.post('/', validateMessageData, async (req, res) => {
    try {
        console.log('Creating message with data:', {
            username: req.body.username,
            content: req.body.content
        });
        
        const message = new Message({
            username: req.body.username,
            content: req.body.content,
            timestamp: new Date(),
        });

        console.log('Message object before save:', message);
        
        const savedMessage = await message.save();
        console.log('Message saved successfully:', savedMessage._id);
        
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: savedMessage
        });
    } catch (error) {
        console.error('Error saving message:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            errors: error.errors
        });
        
        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Message validation failed',
                details: validationErrors
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Duplicate Error',
                message: 'Duplicate entry detected'
            });
        }
        
        res.status(500).json({ 
            error: 'Database Error',
            message: 'Failed to save message',
            details: error.message 
        });
    }
});

// Clear all messages
router.delete('/', async (req, res) => {
    try {
        console.log('Clearing all messages...');
        
        const result = await Message.deleteMany({});
        console.log('Messages cleared successfully:', result.deletedCount);
        
        res.json({
            success: true,
            message: 'All messages cleared successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error clearing messages:', error);
        res.status(500).json({ 
            error: 'Database Error',
            message: 'Failed to clear messages',
            details: error.message 
        });
    }
});

module.exports = router;
