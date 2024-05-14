export const splTokenTemplate = `
// Example SPL Token Template
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from '@solana/spl-token';

async function createSPLToken() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const payer = Keypair.generate();
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,
    null,
    9 // Decimals
  );
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer.publicKey,
    1000
  );
  console.log('SPL Token Mint Address:', mint.toBase58());
  console.log('Token Account Address:', tokenAccount.address.toBase58());
}
createSPLToken();
`;
