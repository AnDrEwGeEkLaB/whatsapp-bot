// src/index.ts
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import whatsappClient from './whatsappClient'; // Import the WhatsApp client
import { Chat } from 'whatsapp-web.js';

// Create Express app
const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://andrew:TqdXscpxrl6q8nBd@cluster0.1qzsylk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Endpoint to send a message
app.post('/send-message', async (req: Request, res: Response) => {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        const chat: Chat = await whatsappClient.getChatById(to);
        await chat.sendMessage(message);
        res.status(200).json({ success: 'Message sent' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
