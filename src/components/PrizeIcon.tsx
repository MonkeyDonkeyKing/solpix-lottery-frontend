import { useState } from "react";
import { Portal } from "./Portal";
import styles from "./PrizeIcon.module.css";
import Image from "next/image";
import ModalCard from "./ModalCard";
import { RouterOutputs } from "@/utils/api";


const PrizeIcon = ({prizes}:{prizes: RouterOutputs["lottery"]["getAllLotteries"][number]["account"]["prizes"]}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.solicon} onClick={() => setIsOpen(!isOpen)}>
      <Image
        src="/solanaIcon.png"
        width={40}
        height={40}
        alt="Picture of the author"
      ></Image>
      <p>Whats the price ?!</p>
      {isOpen && <Portal>
        <div className={styles.modal}>
          <div className={styles.card}>
              <h1>Solana Prices & NFT(s)</h1>
            <section>
              <div className={styles.imagecontainer}>
                <ModalCard prizes={prizes} ></ModalCard>
              </div>
            </section>
          </div>
        </div>
      </Portal>}
    </div>
  );
};

export default PrizeIcon;
