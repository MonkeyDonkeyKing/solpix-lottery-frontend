import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import { FC, useCallback } from "react";

export const SendTransaction: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // Sender
  const senderAddress = publicKey;

  // Receiver addresses - solpix wallet and project wallet
  const receiver1Address = new PublicKey(
    "6fMUyugMke8TaRCtj7w8WW4g6Jp1KYe9TabQJCujxeJr"
  );
  const receiver2Address = new PublicKey(
    "FUCKA33Mw3KjZBENMkwNVuXdHhcecAyMvnhNzfwx7DqU"
  );

  // Lamport amount to send
  const lamportsToSendTotal = 1000000;
  const lamportsToPerProject = lamportsToSendTotal / 2;

  let transaction = new Transaction();

  const onClick = useCallback(async () => {
    if (!publicKey) {
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    let signature: TransactionSignature = "";
    try {
      if (senderAddress != null) {
        const senderAccount = await connection.getAccountInfo(senderAddress);
        transaction = new Transaction({ feePayer: senderAddress });

        // Create instructions to send to first wallet
        const instruction1 = SystemProgram.transfer({
          fromPubkey: senderAddress,
          toPubkey: receiver1Address,
          lamports: lamportsToPerProject,
        });
        transaction.add(instruction1);

        // Create instructions to send to second wallet
        const instruction2 = SystemProgram.transfer({
          fromPubkey: senderAddress,
          toPubkey: receiver2Address,
          lamports: lamportsToPerProject,
        });
        transaction.add(instruction2);
      }

      // Get the latest block hash to use on our transaction and confirmation
      let latestBlockhash = await connection.getLatestBlockhash();

      // Create a new TransactionMessage with version and compile it to legacy
      const messageLegacy = new Transaction().add(transaction).compileMessage();

      // Send transaction and await for signature
      signature = await sendTransaction(
        messageLegacy as unknown as Transaction,
        connection
      );

      // Confirm transaction
      await connection.confirmTransaction(signature, "confirmed");

      console.log(signature);
    } catch (error: any) {
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [publicKey, connection, sendTransaction]);

  return (
    <div>
      <div>
        <button onClick={onClick} disabled={!publicKey}>
          <div>Wallet not connected</div>
          <span>Send Transaction</span>
        </button>
      </div>
    </div>
  );
};
