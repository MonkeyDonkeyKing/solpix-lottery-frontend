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
import { api } from "@/utils/api";

const Header = () => {
  const { publicKey, disconnect} = useWallet();
  const { setVisible } = useWalletModal();
  
  const { data: isAdmin } = api.lottery.isAdmin.useQuery(
    {
      admin: publicKey?.toBase58()!,
    },
    {
      enabled: !!publicKey,
    }
  );

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
        {isAdmin && (
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
