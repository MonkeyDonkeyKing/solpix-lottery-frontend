import styles from "./InfoSection.module.css";

const InfoSection = () => {
  return (
    <section className={styles.infosection}>
      <div>
        <h1>1</h1>
        <p>Select and connect your wallet to the lottery platform to begin your exciting journey into the world of chances and possibilities. Get ready to experience a seamless connection like never before.</p>
      </div>
      <div>
        <h1>2</h1>
        <p>Purchase a ticket for any ongoing lottery and increase your odds of hitting the jackpot. With every ticket, you are one step closer to turning your dreams into reality. Dont miss out on this golden opportunity.</p>
      </div>
      <div>
        <h1>3</h1>
        <p>Watch the lottery being drawn live on our dynamic platform, either on Discord for a more interactive experience or in your preferred browser for a hassle-free viewing. Witness the suspense unfold before your eyes.</p>
      </div>
      <div>
        <h1>4</h1>
        <p>Claim your prize and/or ticket rent back effortlessly, ensuring that your winnings are promptly and securely in your possession. Its time to reap the rewards of your well-deserved success. Congratulations on your victory!</p>
      </div>
    </section>
  );
};

export default InfoSection;
