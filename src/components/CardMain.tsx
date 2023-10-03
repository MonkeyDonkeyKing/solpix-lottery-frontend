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
import { RouterOutputs } from "@/utils/api";

const CardMain = ({
  lotteryData,
  address,
}: {
  lotteryData: RouterOutputs["lottery"]["getAllLotteries"][number]["account"];
  address: PublicKey;
}) => {
  const user = useWallet();
  // const program = useProgram();
  
  // const ticketPrice = parseInt(lotteryData.ticketPrice.toString()) / 1e7;
  const ticketPrice = parseInt(lotteryData.ticketPrice);

  const { connection } = useConnection();
  const [value, setValue] = useState(0);
  // const buyTicket = api.lottery.buyTicket.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const hexToReadableDate = (hexTime) => {
    const unixTime = parseInt(hexTime, 16) * 1000; // Convert to milliseconds
    const date = new Date(unixTime);
    return date.toLocaleString(); // Customize the date format as needed
  };
  console.log(lotteryData.lotteryType.time?.endTime);
  const endTime = hexToReadableDate((lotteryData.lotteryType.time?.endTime));

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
          {/* <PrizeIcon sol={lotteryData.solPrizes} nfts={lotteryData.nfts} /> */}
          <TimeBox isoProp={lotteryData.lotteryType.time?.endTime} />
        </div>
        <div id={styles["card-layout"]}>
          <section className={styles.cardcolumn}>
            <span
              className={styles.ticketlabel}
              style={{ textTransform: "uppercase" }}
            >
              {endTime}
            </span>
            <div>Lottery ID: {lotteryData.lotteryId}</div>
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
              <span>{Number(ticketPrice)} SOL</span>
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
                max={3}
                onChange={handleInputChange}
              />
              <button onClick={() => setValue(1)}>1</button>
              <button onClick={() => setValue(2)}>2</button>
              <button onClick={() => setValue(3)}>3</button>
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
