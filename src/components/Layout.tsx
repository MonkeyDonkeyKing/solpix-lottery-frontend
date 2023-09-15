import Footer from "./Footer";
import Header from "./Header";
import styles from "./Layout.module.css";

const Layout: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
