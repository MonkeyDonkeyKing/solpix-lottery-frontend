import { PublicKey } from "@solana/web3.js";
import styles from "./ModalCard.module.css";
import { RouterOutputs } from "@/utils/api";


const ModalCard = ({ prizes }:{prizes: RouterOutputs["lottery"]["getAllLotteries"][number]["account"]["prizes"]}) => {
  console.log(prizes)

  
  
  return (
    <><div className={styles.wrapper}>
      {prizes[0]?.nft &&
        <div className={styles.container} >
          {prizes.map((prize, index) => (
            <div className={styles.card} key={index}>
              {/* <img src={nft.image} alt={`NFT ${prize.nft?.mint}`} /> */}
              <p className={styles.name}>{prize.nft?.mint.toString()}</p>
              <p>TEST</p>
            </div>
          ))}
        </div>
      }
      {prizes[0]?.pool &&
        <div className={styles.container} >
          {prizes.map((prize, index) => (
            <div className={styles.card} key={index} >
              <p className={styles.name}>{prize.pool?.value} %</p>
            </div>
          ))}
        </div>
      }
    </div>
    </>
  );
};

export default ModalCard;
