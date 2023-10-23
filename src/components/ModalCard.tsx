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
              <div className={styles.card} key={index}>
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
