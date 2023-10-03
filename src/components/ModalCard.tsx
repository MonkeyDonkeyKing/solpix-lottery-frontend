import { PublicKey } from "@solana/web3.js";
import styles from "./ModalCard.module.css";

type NFT = {
  mint?: PublicKey,
}

type ModalCardProps = {
  nfts: NFT[],
  sol: number[]
};

const ModalCard: React.FC<ModalCardProps> = ({ sol, nfts }) => {
  return (
    <><div className={styles.wrapper}>
      {nfts &&
        <div className={styles.container} >
          {nfts.map((nft,index) => (
            <div className={styles.card} key={index}>
              <img src={nft.image} alt={`NFT ${nft.name}`} />
              <p className={styles.name}>{nft.name}</p>
              <p>TEST</p>
            </div>
          ))}
        </div>
      }
      {sol &&
        <div className={styles.container} >
          {sol.map((prizeSingle, index) => (
            <div className={styles.card} key={index} >
              <p className={styles.name}>{prizeSingle} SOL</p>
            </div>
          ))}
        </div>
      }
    </div>
    </>
  );
};

export default ModalCard;
