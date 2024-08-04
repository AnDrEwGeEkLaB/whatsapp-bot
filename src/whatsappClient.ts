// src/whatsappClient.ts
import { Client, LocalAuth, Message, Chat } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import Session from './sessionModel'

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-id", // Customize this if needed
    })
});

client.on('qr', (qr: string) => {
    qrcode.generate(qr, { small: true });
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

client.initialize();

export default client;
