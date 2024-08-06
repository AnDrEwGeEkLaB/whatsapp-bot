import express, { Request, Response } from 'express';
import { initializeClient, getQRCode, client } from './whatsappClient';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
app.use(express.json());
const port = process.env.PORT || "3000";

// Initialize WhatsApp client
initializeClient().catch(err => console.error('Error initializing WhatsApp client:', err));

// WebSocket server setup
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', ws => {
  console.log('WebSocket connection established');

  client.on('message', async msg => {
    console.log(`Received message: ${msg.body}`);
    ws.send(JSON.stringify({ from: msg.from, body: msg.body }));
  });

  client.on('qr', (qr: string) => {
    ws.send(JSON.stringify({ body: qr }));
  });

});

// Express endpoints
app.get('/get-qr-code', async (req: Request, res: Response) => {
  try {
    const qrCode = await getQRCode();
    res.status(200).json({ qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get QR code' });
  }
});

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

// Handle WebSocket upgrade requests
const server = app.listen(port, () => {
  console.log('Server running on port 3000');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});
