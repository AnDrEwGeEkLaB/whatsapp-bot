// src/index.ts
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { initializeClient, getQRCode, client } from './whatsappClient'; // Import updated WhatsApp client functions and client instance

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://andrew:TqdXscpxrl6q8nBd@cluster0.1qzsylk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Initialize WhatsApp client
initializeClient().catch(err => console.error('Error initializing WhatsApp client:', err));

// Endpoint to request QR code
app.get('/get-qr-code', async (req: Request, res: Response) => {
    try {
        const qrCode = await getQRCode();
        return res.status(200).json({ qrCode });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get QR code' });
    }
});

// Endpoint to send a message
app.post('/send-message', async (req: Request, res: Response) => {
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        if (!client) {
            return res.status(500).json({ error: 'WhatsApp client not initialized' });
        }

        const chat = await client.getChatById(to);
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
