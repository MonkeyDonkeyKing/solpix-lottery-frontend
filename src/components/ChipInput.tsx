import styles from "./ChipInput.module.css";

type ChipProps = {
  content?: string;
  soldTickets?: number;
  maxTickets?: number;
  link?: string;
};

const ChipInput = ({content, link, soldTickets,maxTickets} : ChipProps) => {
  return (
    <div className={styles.chipinput}>
      {content && <p>{content}</p>}
      {maxTickets && <p>{soldTickets} / {maxTickets}</p>}
      {link && <a href={link}>Watch Live</a>}
    </div>
  );
};

export default ChipInput;
