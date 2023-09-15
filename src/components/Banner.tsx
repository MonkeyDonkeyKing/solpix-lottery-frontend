import styles from "./Banner.module.css";
import ChipInput from "./ChipInput";

type BannerProps = {
  imageUrl?: string;
  imageAlt?: string;
  heading: string;
  subHeaderDraw?: string;
  time?: string;
  paragraph?: string;
  id?: string,
  prizePool?: string,
  maxTickets?: number,
  soldTickets?: number,
};

const Banner = ({
  imageUrl,
  imageAlt,
  heading,
  paragraph,
  subHeaderDraw,
  time,
  id,
  prizePool,
  maxTickets,
  soldTickets
}: BannerProps) => {
  const hasImage = !!imageUrl;

  return (
    <div
      className={`${styles.banner} ${hasImage ? styles.withImage : ""}`}
    >
      {imageUrl && <img src={imageUrl} alt={imageAlt} />}
      <h1>{heading.toLocaleUpperCase()}</h1>
      {subHeaderDraw && (
        <>
        <h2>
          {subHeaderDraw} <span>{time}</span>
        </h2>
        <div className={styles.chipcontainer}>
        <ChipInput content={ id as string} />
        <ChipInput content={prizePool as string} />
        <ChipInput maxTickets={maxTickets as number}  soldTickets={soldTickets as number} />
        </div>
        </>
      )}
      {paragraph && <p>{paragraph}</p>}
    </div>
  );
};

export default Banner;
