import { RouterOutputs } from "@/utils/api";
import styles from "./CardDrawing.module.css";
import React, { useState } from "react";
import TimeBox from "./TimeBox";
import {
  PublicKey,
} from "@solana/web3.js";
import Image from "next/image";
import { useRouter } from "next/router";

interface CardDrawingProps {
  lotteryData: RouterOutputs['lottery']['getLotteries'][number]['account'];
  address: PublicKey;
}


const CardDrawing: React.FC<CardDrawingProps> = ({ lotteryData, address }) => {
  const router = useRouter();
  const endTime = new Date(lotteryData.endTime);
  const isEndTimePassed = Date.now() >= endTime.getTime();
  const ticketPrice = (parseInt(lotteryData.ticketPrice.toString(), 16) / 1e9).toFixed(2);

  const handleViewDetails = () => {
    router.push({
      pathname: '/drawingDetail',
      query: {
        id: lotteryData.id,
        endTime: lotteryData.endTime,
        numberOfTicketsSold: lotteryData.possibleWinners,
        numberOfTickets: lotteryData.numberOfTickets,
        ticketPrice: ticketPrice,
        name: 'Test Lottery Name'
      },
    });
  };


  return (
    <>
      <div className={styles.card}>
        <div className={styles.iconwrapper}>
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
            {/* <div>{lotteryData.name}</div> */}
            <div>{"lottery name"}</div>
          </section>
          <section className={styles.middlesection}>
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
          <section className={styles.imagesection}>
            <Image src="/solanaIconScaled.png" width={100} height={100} alt="Picture of the author"></Image>
          </section>
          <section className={styles.lastsection}>
            <div className={styles.buybutton}>
              <button style={{ textTransform: 'uppercase' }} onClick={handleViewDetails} disabled={!isEndTimePassed}>
                View Details
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CardDrawing;
