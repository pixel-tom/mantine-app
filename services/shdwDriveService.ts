// services/shdwDriveService.ts
import { ShdwDrive } from "@shadow-drive/sdk";
import { Connection, PublicKey } from "@solana/web3.js";

export const deleteStorageAccount = async (connection: Connection, wallet: any, publicKey: string) => {
  const drive = new ShdwDrive(connection, wallet);
  await drive.init();
  return drive.deleteStorageAccount(new PublicKey(publicKey));
};

export const makeStorageImmutable = async (connection: Connection, wallet: any, publicKey: string) => {
  const drive = new ShdwDrive(connection, wallet);
  await drive.init();
  return drive.makeStorageImmutable(new PublicKey(publicKey));
};
