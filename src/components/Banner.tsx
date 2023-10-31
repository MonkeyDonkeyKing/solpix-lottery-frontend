import styles from "./Banner.module.css";
import ChipInput from "./ChipInput";

type BannerProps = {
  imageUrl?: string;
  imageAlt?: string;
  heading: string;
  subHeaderDraw?: string;
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {imageUrl && <img src={imageUrl} alt={imageAlt} />}
      <h1>{heading.toLocaleUpperCase()}</h1>
      {subHeaderDraw && (
        <>
          <h2>
            {subHeaderDraw}
          </h2>
          <div className={styles.chipcontainer}>
            <ChipInput content={"NexDraw ID: " + id} />
            {prizePool && <ChipInput content={"Prize Pool: " + parseFloat(prizePool).toFixed(2)} />}
            <ChipInput maxTickets={maxTickets} soldTickets={soldTickets} />
          </div>
        </>
      )}
      {paragraph && <p>{paragraph}</p>}
    </div>
  );
};

export default Banner;
