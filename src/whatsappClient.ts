// src/whatsappClient.ts
import { Client, LocalAuth, Message, Chat } from 'whatsapp-web.js';
import Session from './sessionModel'; // Import the Mongoose model

let client: Client;

const initializeClient = (): Promise<Client> => {
  return new Promise((resolve, reject) => {
    client = new Client({
      authStrategy: new LocalAuth({
        clientId: "client-id", // Customize this if needed
      })
    });

    client.on('qr', (qr: string) => {
      // QR code generation is now handled explicitly on request
      resolve(client); // Resolve promise once client is initialized
    });

    client.on('authenticated', async (session: object) => {
      await Session.findOneAndUpdate(
        { clientId: "client-id" }, // Customize this if needed
        { session },
        { upsert: true }
      );
    });

    client.on('auth_failure', async () => {
      await Session.deleteOne({ clientId: "client-id" });
    });

    client.on('ready', () => {
      console.log('Client is ready!');
    });

    client.initialize();
  });
};

const getQRCode = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.on('qr', (qr: string) => {
      resolve(qr);
    });
  });
};

export { initializeClient, getQRCode, client };
