export const usefulFile2 = `
// Example Useful File 2
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
} from '@solana/web3.js';

async function transferSOL() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const from = Keypair.generate();
  const to = new PublicKey('RECIPIENT_PUBLIC_KEY_HERE');
  const transaction = await connection.requestAirdrop(from.publicKey, 1e9); // 1 SOL
  await connection.confirmTransaction(transaction);
  const transferTransaction = await connection.transfer(from, to, 1e9); // 1 SOL
  await connection.confirmTransaction(transferTransaction);
  console.log('Transfer Complete');
}
transferSOL();
`;
