export const usefulFile1 = `
// Example Useful File 1
import {
  Connection,
  PublicKey,
  clusterApiUrl,
} from '@solana/web3.js';

async function getBalance(publicKey: string) {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const balance = await connection.getBalance(new PublicKey(publicKey));
  console.log('Balance:', balance);
}
getBalance('YOUR_PUBLIC_KEY_HERE');
`;
