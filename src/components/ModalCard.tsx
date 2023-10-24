/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @next/next/no-img-element */
import { PublicKey } from "@solana/web3.js";
import styles from "./ModalCard.module.css";
import { RouterOutputs, api } from "@/utils/api";
import { LOTTERY_PROGRAM_ID } from "@/pages/adminAddPrizes";

const ModalCard = ({
  prizes,
  publicKey,
}: {
  prizes: RouterOutputs["lottery"]["getAllLotteries"][number]["account"]["prizes"];
  publicKey: PublicKey;
}) => {
  const lotteryNfts = api.fetching.fetchAddressNfts.useQuery({
    address: getPrizeVaultPda(new PublicKey(publicKey))[0].toBase58(),
  });

  const getBorderStyle = (value: number | undefined) => {
    if(!value) return;
    const intValue = value;

    switch (true) {
    case intValue >= 100:
      return styles.borderRed100;
    case intValue >= 90:
      return styles.borderRed90;
    case intValue >= 80:
      return styles.borderRed80;
    case intValue >= 70:
      return styles.borderRed70;
    case intValue >= 60:
      return styles.borderRed60;
    case intValue >= 50:
      return styles.borderRed50;
    case intValue >= 40:
      return styles.borderRed40;
    case intValue >= 30:
      return styles.borderRed30;
    case intValue >= 20:
      return styles.borderRed20;
    case intValue >= 10:
      return styles.borderRed10;
    default:
      return "";
  }
  };

  return (
    <>
      <div className={styles.wrapper}>
          <div className={styles.container}>
            {lotteryNfts.data?.map((nft, index) => (
              <div className={styles.card} key={index}>
                <img src={nft.image} alt={`NFT ${nft.name}`} />
                <p className={styles.name}>{nft.name}</p>
              </div>
            ))}
          </div>
        {prizes[0]?.pool && (
          <div className={styles.container}>
            {prizes.map((prize, index) => (
              <div
                className={`${styles.card} ${getBorderStyle(prize.pool?.value)}`}
                key={index}
              >
                <p className={styles.name}>{prize.pool?.value} %</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ModalCard;

const getPrizeVaultPda = (lottery: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("lottery"),
      LOTTERY_PROGRAM_ID.toBuffer(),
      lottery.toBuffer(),
      Buffer.from("vault"),
    ],
    LOTTERY_PROGRAM_ID
  );
};
