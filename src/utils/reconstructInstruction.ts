import { PublicKey, TransactionInstruction } from "@solana/web3.js";

export default function reconstructInstruction(serializedData: any) {
  // Create PublicKey instances for all public keys
  for (let keyData of serializedData.keys) {
    keyData.pubkey = new PublicKey(keyData.pubkey);
  }

  // Create PublicKey for programId
  serializedData.programId = new PublicKey(serializedData.programId);

  // Convert data array back into Buffer
  serializedData.data = Buffer.from(serializedData.data);

  // Construct TransactionInstruction instance
  let transactionInstruction = new TransactionInstruction(serializedData);

  return transactionInstruction;
}
