import styles from "./CardMain.module.css";
import React, { useState } from "react";
import { Divider } from "@mui/material/";
import PrizeIcon from "./PrizeIcon";
import TimeBox from "./TimeBox";

import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const CardMain = ({
  lotteryData,
  address,
}: {
  lotteryData: [RouterOutputs["lottery"]["getLotteries"][number]["account"]];

  address: PublicKey;
}) => {
  const user = useWallet();
  // const program = useProgram();
  const endTime = new Date(lotteryData.endTime);
  const ticketPrice = parseInt(lotteryData.ticketPrice.toString(), 16) / 1e9;

  const { connection } = useConnection();
  const [value, setValue] = useState(0);
  // const buyTicket = api.lottery.buyTicket.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  // const handleBuy = async () => {
  //   const vaultPda = getVaultPda(address);
  //   if (!user || !user.publicKey) return;
  //   let ixs = [] as any;
  //   for (let i = 0, len = value; i < len; i++) {
  //     const ticketPda = getTicketPda(lotteryData.nextTicketId + i, address);
  //     const { instructions } = await buyTicket({
  //       accounts: {
  //         LotteryAccountPda: address,
  //         lotteryTicketPda: ticketPda,
  //         lotteryVaultPda: vaultPda,
  //         payer: user.publicKey,
  //       },
  //       program: program,
  //     });
  //     console.log("instructions: ", instructions);
  //     ixs = [...ixs, ...instructions];
  //   }
  // const message = new TransactionMessage({
  //   instructions: ixs,
  //   recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
  //   payerKey: user.publicKey,
  // }).compileToV0Message();
  // let transaction = new VersionedTransaction(message);
  // transaction = await user.signTransaction!(transaction);
  // const txId = await connection.sendTransaction(transaction);
  //   const blockhash = await connection.getLatestBlockhashAndContext();
  //   const confirmedTx = await connection.confirmTransaction({
  //     blockhash: blockhash.value.blockhash,
  //     lastValidBlockHeight: blockhash.value.lastValidBlockHeight,
  //     minContextSlot: blockhash.context.slot,
  //     signature: txId,
  //   });
  //   if (confirmedTx.value.err) {
  //     throw new Error(`${confirmedTx.value.err}`);
  //   }
  //   console.log("transaction succesfull: ", txId);
  //   return txId;
  // };

  return (
    <>
      <section className={styles.card}>
        <div className={styles.iconwrapper}>
          <PrizeIcon sol={lotteryData.solPrizes} nfts={lotteryData.nfts} />
          <TimeBox isoProp={endTime} />
        </div>
        <div id={styles["card-layout"]}>
          <section className={styles.cardcolumn}>
            <span
              className={styles.ticketlabel}
              style={{ textTransform: "uppercase" }}
            >
              {endTime.toDateString()}
            </span>
            <div>{lotteryData.name}</div>
          </section>
          <Divider orientation="vertical" flexItem />
          <section>
            <div className={styles.cardcolumn}>
              <span
                className={styles.ticketlabel}
                style={{ textTransform: "uppercase" }}
              >
                Ticket price:{" "}
              </span>
              <span>{Number(ticketPrice).toFixed(2)} SOL</span>
            </div>
            <div className={styles.cardcolumn}>
              <span
                className={styles.ticketlabel}
                style={{ textTransform: "uppercase" }}
              >
                Remaining:{" "}
              </span>
              <span>
                {lotteryData.nextTicketId} / {lotteryData.numberOfTickets}
              </span>
            </div>
          </section>
          <Divider orientation="vertical" flexItem />
          <section>
            <div className={styles.buysection}>
              <input
                type="number"
                value={value}
                min={0}
                onChange={handleInputChange}
              />
              <button onClick={() => setValue(5)}>5</button>
              <button onClick={() => setValue(10)}>10</button>
              <button onClick={() => setValue(20)}>20</button>
            </div>
            <div className={styles.buybutton}>
              <button style={{ textTransform: "uppercase" }}>
                Buy for {(value * Number(ticketPrice)).toFixed(2)} SOL
              </button>
              <span
                className={styles.buychance}
                style={{ textTransform: "uppercase" }}
              >
                {((value / lotteryData.numberOfTickets) * 100).toFixed(0)} % WIN{" "}
              </span>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default CardMain;
