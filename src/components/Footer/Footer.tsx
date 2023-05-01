import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.Footer}>
      <div className={styles.Line}></div>
      <div className={styles.Name}> Edric Khoo</div>

      <div className={styles.Line}></div>
    </div>
  );
};

export default Footer;
