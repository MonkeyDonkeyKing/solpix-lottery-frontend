import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { NextPage } from "next";
import { useState } from "react";
import { abstractInitMasterTransactionIx } from "@solpix/lottery_program/src/api/instructions/abstractInitMasterIx";
import Head from "next/head";
import Layout from "@/components/Layout";

const AssignMaster: NextPage = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [newMaster, setNewMaster] = useState<string>("");
  const [allowance, setAllowance] = useState<number>(0);
  const [assignee, setAssignee] = useState<string>("");
  const [fee, setFee] = useState<number>(0);

  const send = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) return;
    const pubkey = Keypair.generate().publicKey;
    console.log(pubkey.toBase58());
    const instruction = abstractInitMasterTransactionIx({
      args: {
        params: {
          allowance,
          fee,
          // assignee: wallet.publicKey,
          assignee: pubkey,
        },
      },
    });
    const txix = new TransactionMessage({
      instructions: [instruction],
      payerKey: wallet.publicKey,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    }).compileToV0Message();
    const tx = await wallet.signTransaction(new VersionedTransaction(txix));
    try {
      const hash = await connection.sendTransaction(tx);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Head>
        <title>Assign master section</title>
        <meta name="description" content="Solpix Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <section>
          <h1>Assign Lottery master</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              color: "white",
            }}
          >
            <label>
              new master:
              <input
                type="text"
                value={newMaster}
                onChange={(e) => setNewMaster(e.target.value)}
              />
            </label>
            <h1>Settings</h1>
            <label>
              allowance:
              <input
                type="number"
                value={allowance}
                onChange={(e) => setAllowance(parseInt(e.target.value))}
                min={0}
              />
            </label>
            <label>
              assignee:
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </label>
            <label>
              fee:
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(parseInt(e.target.value))}
                min={0}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </section>
      </Layout>
    </>
  );
};

export default AssignMaster;
