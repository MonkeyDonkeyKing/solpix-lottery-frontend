import React from "react";
import styles from "./PrizeCard.module.css";

type PrizeCardProps = {
  price: number;
  onRemove?: () => void;
};

const PrizeCard: React.FC<PrizeCardProps> = ({ price, onRemove }) => {
  return (
    <div className={styles.prizeCard}>
      <p>{price} %</p>
      {/* <button onClick={onRemove}>Remove</button> */}
    </div>
  );
};

export default PrizeCard;