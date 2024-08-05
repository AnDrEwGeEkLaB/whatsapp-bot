import { Client, LocalAuth } from 'whatsapp-web.js';

let client: Client;

const initializeClient = (): Promise<Client> => {
  return new Promise((resolve, reject) => {
    client = new Client({
      authStrategy: new LocalAuth({
        clientId: "client-id", 
      })
    });

    client.on('qr', (qr: string) => {
      resolve(client); // Resolve promise once client is initialized
    });


    client.on('ready', () => {
      console.log('Client is ready!');
      resolve(client);
    });

    client.on('auth_failure', msg => {
      console.error('Authentication failure', msg);
      reject(new Error('Authentication failure'));
    });

    client.on('disconnected', reason => {
      console.log('Client disconnected', reason);
      reject(new Error('Client disconnected'));
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
