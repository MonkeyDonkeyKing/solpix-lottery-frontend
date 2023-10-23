import styles from "./CardMain.module.css";
import React, { useState } from "react";
import { Divider } from "@mui/material/";
import PrizeIcon from "./PrizeIcon";
import TimeBox from "./TimeBox";

import {
  MessageV0,
  type PublicKey,
  VersionedTransaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { type RouterOutputs, api } from "@/utils/api";
import Link from "next/link";

const CardMain = ({
  lotteryData,
  address,
}: {
  lotteryData: RouterOutputs["lottery"]["getAllLotteries"][number]["account"];
  address: PublicKey;
}) => {
  const user = useWallet();
  const buyTicket = api.lottery.buyTicket.useMutation();

  const { connection } = useConnection();
  const [value, setValue] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const resetTransactionStatus = () => {
    setTimeout(() => {
      setTransactionStatus('idle');
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const hexToReadableDate = (hexTime: string) => {
    const unixTime = parseInt(hexTime, 16) * 1000;
    const date = new Date(unixTime);
    return date.toLocaleDateString();
  };
  const endTime = hexToReadableDate(lotteryData.lotteryType.time?.endTime as string);

  const buyTickets = async () => {
    setTransactionStatus('idle');
    try {
      const instruction = await buyTicket.mutateAsync({
        buyer: user?.publicKey?.toBase58() ?? "",
        lottery: address.toBase58(),
        quantity: value,
      });
      const messagev0 = MessageV0.deserialize(instruction);
      const transaction = new VersionedTransaction(messagev0);
      const txid = await user.sendTransaction(transaction, connection, {
        skipPreflight: true,
      });

      console.log(
        `Transaction for lottery address: ${address.toBase58()}% completed. TXID: ${txid}
        Bought ${value} tickets for ${(
          (value * parseInt(lotteryData.ticketPrice.sol?.value as string, 16)) /
          1000000000
        ).toFixed(2)} SOL`
      );
      setTransactionStatus('success');
      resetTransactionStatus()
    } catch (error) {
      console.log(error);
      setTransactionStatus('error');
      resetTransactionStatus()
    }
  };

  return (
    <>
      <section className={styles.card}>
        <div className={styles.iconwrapper}>
          <PrizeIcon prizes={lotteryData.prizes} publicKey={address} />
          {transactionStatus === 'success' && (
              <div className={styles.messageSuccess}>Transaction Successful</div>
            )}
            {transactionStatus === 'error' && (
              <div className={styles.messageError}>Transaction Failed</div>
            )}
          <TimeBox isoProp={lotteryData.lotteryType.time?.endTime as string} />
        </div>
        <div id={styles["card-layout"]} className={`${transactionStatus === 'success' ? styles.success : transactionStatus === 'error' ? styles.error : ''}`}>
          <section className={styles.cardcolumn}>
           
            <span
              className={styles.ticketlabel}
              style={{ textTransform: "uppercase" }}
            >
              {endTime}
            </span>
            <Link href={`/lotteries/${address.toBase58()}`}>NexDraw ID:  {lotteryData.lotteryId}</Link>
          </section>
          <Divider orientation="vertical" flexItem />
          <section>
            <div className={styles.cardcolumn}>
              <span
                className={styles.ticketlabel}
                style={{ textTransform: "uppercase" }}
              >
                Ticket price:
              </span>
              <span>
                {parseInt(lotteryData.ticketPrice.sol?.value as string, 16) / 1000000000}{" "}
                SOL
              </span>
            </div>
            <div className={styles.cardcolumn}>
              <span
                className={styles.ticketlabel}
                style={{ textTransform: "uppercase" }}
              >
                Remaining:{" "}
              </span>
              <span>
                {lotteryData.ticketsSold} / {lotteryData.maxTicketsForSale}
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
              <button
                style={{ textTransform: "uppercase" }}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={buyTickets}
              >
                Buy for{" "}
                {(
                  (value * parseInt(lotteryData.ticketPrice.sol?.value as string, 16)) /
                  1000000000
                ).toFixed(2)}{" "}
                SOL
              </button>
              <span
                className={styles.buychance}
                style={{ textTransform: "uppercase" }}
              >
                {((value / lotteryData.maxTicketsForSale) * 100).toFixed(0)} %
                WIN{" "}
              </span>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default CardMain;
