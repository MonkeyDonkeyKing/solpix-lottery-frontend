import { type Metadata } from "@metaplex-foundation/js";
import styles from "./NFTCard.module.css";

type NFTCardProps = {
  nft: Metadata;
  isSelected?: boolean;
  onSelect?: (address: string) => void;
};

const NFTCard: React.FC<NFTCardProps> = ({ nft, isSelected, onSelect }) => {
  const handleClick = () => {
    if (nft && isSelected != undefined) {
      onSelect!(nft.mintAddress as unknown as string);
    }
  };
  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      onClick={handleClick}
    >
      {nft?.image && <img src={nft.image} alt={`NFT ${nft.name}`} />}
      <p className={styles.name}>{nft?.name}</p>
    </div>
  );
};

export default NFTCard;
