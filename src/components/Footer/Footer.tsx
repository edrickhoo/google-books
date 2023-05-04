import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.Footer}>
      <div data-testid="line" className={styles.Line}></div>
      <div className={styles.Name}> Edric Khoo</div>

      <div data-testid="line" className={styles.Line}></div>
    </div>
  );
};

export default Footer;
