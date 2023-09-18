// Header.tsx
import {
  WalletMultiButton,
  useWalletModal,
} from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import styles from "./Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicket,
  faPencil,
  faHandshake,
  faWallet,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "@solana/wallet-adapter-react";

const Header = () => {
  const { publicKey, disconnect} = useWallet();
  const { setVisible } = useWalletModal();
  const allowedWallets = [
    "6fMUyugMke8TaRCtj7w8WW4g6Jp1KYe9TabQJCujxeJr",
    "YOUR_ALLOWED_WALLET_PUBLIC_KEY_2",
  ];

  const isAllowedWallet =
    publicKey && allowedWallets.includes(publicKey.toBase58());

  return (
    <div className={styles.navigation}>
      <nav>
        <Link href={"/"}>
          <h3>LOTTERY</h3>
        </Link>
        <li>
          <FontAwesomeIcon icon={faTicket} />
          <Link href={"/tickets"}>Tickets</Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faPencil} />
          <Link href={"/drawing"}>Drawing</Link>
        </li>
        <li>
          <FontAwesomeIcon icon={faHandshake} />
          <Link href={"/collaborate"}>Collaborate</Link>
        </li>
        {isAllowedWallet && (
          <li>
            <FontAwesomeIcon icon={faScrewdriverWrench} />
            <Link href={"/adminOverview"}>Admin</Link>
          </li>
        )}
        <li>
          <FontAwesomeIcon icon={faWallet} />
          <button
            className={styles.walletButton}
            onClick={!publicKey ? () => setVisible(true) : () => disconnect()}
          >
            {publicKey ? "Disconnect" : "Connect"}
          </button>
        </li>
      </nav>
    </div>
  );
};

export default Header;
