/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import { Portal } from "./Portal";
import styles from "./PrizeIcon.module.css";
import Image from "next/image";
import ModalCard from "./ModalCard";
import { type RouterOutputs } from "@/utils/api";
import { type PublicKey } from "@solana/web3.js";


const PrizeIcon = ({prizes, publicKey}:{prizes: any,publicKey: PublicKey}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.solicon} onClick={() => setIsOpen(!isOpen)}>
      <Image
        src="/solanaIcon.png"
        width={40}
        height={40}
        alt="Picture of the author"
      ></Image>
      <p>Whats the prize ?!</p>
      {isOpen && <Portal>
        <div className={styles.modal}>
          <div className={styles.card}>
              <h1>NexDraw event prizes</h1>
            <section>
              <h3>Prizes are NFT(s) and %-Prize based on the pricepool in solana</h3>
              <div className={styles.imagecontainer}>
                <ModalCard prizes={prizes} publicKey={publicKey}></ModalCard>
              </div>
            </section>
          </div>
        </div>
      </Portal>}
    </div>
  );
};

export default PrizeIcon;
