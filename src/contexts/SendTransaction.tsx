/* eslint-disable @typescript-eslint/no-misused-promises */
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import { FC, useCallback, useEffect, useState } from "react";

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

  const [latestBlockhash, setLatestBlockhash] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestBlockhash = async () => {
      const blockhash = await connection.getRecentBlockhash();
      setLatestBlockhash(blockhash.blockhash);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchLatestBlockhash();
  }, [connection]);

  const onClick = useCallback(async () => {
    if (!publicKey || !latestBlockhash) {
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    let signature: TransactionSignature = "";
    try {
      if (senderAddress) {
        const senderAccount = await connection.getAccountInfo(senderAddress);
        const transaction = new Transaction({ feePayer: senderAddress });

        // Create instructions to send to the first wallet
        const instruction1 = SystemProgram.transfer({
          fromPubkey: senderAddress,
          toPubkey: receiver1Address,
          lamports: lamportsToPerProject,
        });
        transaction.add(instruction1);

        // Create instructions to send to the second wallet
        const instruction2 = SystemProgram.transfer({
          fromPubkey: senderAddress,
          toPubkey: receiver2Address,
          lamports: lamportsToPerProject,
        });
        transaction.add(instruction2);

        // Send transaction and await for signature
        signature = await sendTransaction(transaction, connection);

        // Confirm transaction
        await connection.confirmTransaction(signature, "confirmed");

        console.log(signature);
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log("error", `Transaction failed! ${error}`, signature);
      return;
    }
  }, [
    publicKey,
    connection,
    sendTransaction,
    senderAddress,
    receiver1Address,
    receiver2Address,
    lamportsToPerProject,
    latestBlockhash,
  ]);

  return (
    <div>
      <div>
        {(!publicKey || !latestBlockhash) && <div>Wallet not connected</div>}
        <button onClick={onClick} disabled={!publicKey || !latestBlockhash}>
          <span>Send Transaction</span>
        </button>
      </div>
    </div>
  );
};
