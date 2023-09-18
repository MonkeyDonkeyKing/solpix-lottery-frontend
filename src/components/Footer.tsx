import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <ul className={styles.footer}>
      <li><a href="https://discord.gg/solpix" target="_blank">Discord</a></li>
      <li><a href="https://twitter.com/solpixdao" target="_blank">Twitter</a></li>
      <li><a href="" target="_blank">by solpix labs</a></li>
    </ul>
  );
};

export default Footer;
