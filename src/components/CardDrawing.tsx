import { type RouterOutputs } from "@/utils/api";
import styles from "./CardDrawing.module.css";
import React from "react";
import TimeBox from "./TimeBox";
import { type PublicKey } from "@solana/web3.js";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";



const CardDrawing = ({ lotteryData, publicKey }: {
  lotteryData: RouterOutputs["lottery"]["getAllLotteries"][number]["account"],
  publicKey: PublicKey
}) => {
  const router = useRouter();

  const hexToReadableDate = (hexTime: string) => {
    const unixTime = parseInt(hexTime, 16) * 1000; 
    const date = new Date(unixTime);
    return date; 
  };

  const endTime = hexToReadableDate(lotteryData.lotteryType.time?.endTime as string);
  const isEndTimePassed = Date.now() >= endTime.getTime();

  const ticketPrice = (
    parseInt(lotteryData.ticketPrice.sol?.value as string, 16) / 1000000000);

  const handleViewDetails = () => {
    const publicKeyBase58 = publicKey.toBase58();
    void router.push(`/lotteries/${publicKeyBase58}`);
  };

  const handleWatchDrawing = () => {
    void router.push({
      pathname: "/drawingDetail",
      query: {
        id: lotteryData.lotteryId,
        endTime: lotteryData.lotteryType.time?.endTime as string,
        numberOfTicketsSold: lotteryData.ticketsSold,
        numberOfTickets: lotteryData.maxTicketsForSale,
        ticketPrice: ticketPrice,
        lotteryPublicKey: publicKey.toBase58()
      },
    });

  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.iconwrapper}>
          <TimeBox isoProp={lotteryData.lotteryType.time?.endTime as string} />
        </div>
        <div id={styles["card-layout"]}>
          <section className={styles.cardcolumn}>
            <span
              className={styles.ticketlabel}
              style={{ textTransform: "uppercase" }}
            >
              {endTime.toLocaleDateString()}
            </span>
            <Link href={`/lotteries/${publicKey.toBase58()}`}>NexDraw ID:  {lotteryData.lotteryId}</Link>
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
          <section className={styles.imagesection}>
            <Image
              src="/NexDrawLogoWhite.png"
              width={150}
              height={150}
              alt="nexdrawLogo"
            ></Image>
          </section>
          <section className={styles.lastsection}>
            <div className={styles.buybutton}>
              <button
                style={{ textTransform: "uppercase" }}
                onClick={handleViewDetails}
              >
                View Details
              </button>
              {lotteryData.lotteryStatus && Object.keys(lotteryData.lotteryStatus)[0] === 'drawing' &&
                <button
                  style={{ textTransform: "uppercase" }}
                  disabled={!isEndTimePassed}
                  onClick={handleWatchDrawing}
                >
                  Watch Drawing
                </button>}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CardDrawing;