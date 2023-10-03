import { RouterOutputs } from "@/utils/api";
import styles from "./CardDrawing.module.css";
import React, { useState } from "react";
import TimeBox from "./TimeBox";
import { PublicKey } from "@solana/web3.js";
import Image from "next/image";
import { useRouter } from "next/router";



const CardDrawing = ({ lotteryData }: {
  lotteryData: RouterOutputs["lottery"]["getAllLotteries"][number]["account"];
}) => {
  const router = useRouter();

  const hexToReadableDate = (hexTime) => {
    const unixTime = parseInt(hexTime, 16) * 1000; 
    const date = new Date(unixTime);
    return date; 
  };

  const endTime = hexToReadableDate(lotteryData.lotteryType.time?.endTime);
  const isEndTimePassed = Date.now() >= endTime.getTime();

  const ticketPrice = (
    parseInt(lotteryData.ticketPrice.sol?.value, 16) / 1000000000);

  const handleViewDetails = () => {
    router.push({
      pathname: "/drawingDetail",
      query: {
        id: lotteryData.lotteryId,
        endTime: lotteryData.lotteryType.time?.endTime,
        numberOfTicketsSold: lotteryData.ticketsSold,
        numberOfTickets: lotteryData.maxTicketsForSale,
        ticketPrice: ticketPrice,
      },
    });
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.iconwrapper}>
          <TimeBox isoProp={lotteryData.lotteryType.time?.endTime} />
        </div>
        <div id={styles["card-layout"]}>
          <section className={styles.cardcolumn}>
            <span
              className={styles.ticketlabel}
              style={{ textTransform: "uppercase" }}
            >
              {endTime.toLocaleDateString()}
            </span>
            <div>Lottery ID: {lotteryData.lotteryId}</div>
          </section>
          <section className={styles.middlesection}>
            <div className={styles.cardcolumn}>
              <span
                className={styles.ticketlabel}
                style={{ textTransform: "uppercase" }}
              >
                Ticket price:{" "}
              </span>
              <span>
                {parseInt(lotteryData.ticketPrice.sol?.value, 16) / 1000000000}{" "}
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
          <section className={styles.imagesection}>
            <Image
              src="/solanaIconScaled.png"
              width={100}
              height={100}
              alt="Picture of the author"
            ></Image>
          </section>
          <section className={styles.lastsection}>
            <div className={styles.buybutton}>
              <button
                style={{ textTransform: "uppercase" }}
                onClick={handleViewDetails}
                disabled={!isEndTimePassed}
              >
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
