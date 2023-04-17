import { organisedBooksData } from "../../api/google-books-api";
import styles from "./MoreInfoModal.module.scss";

interface Props {
  book: organisedBooksData;
  closeMoreInfoModal: () => void;
}
const MoreInfoModal = ({ book, closeMoreInfoModal }: Props) => {
  const { title, subtitle, authors, image, description } = book;
  return (
    <div>
      <div
        className={styles.ModalBackground}
        onClick={closeMoreInfoModal}
      ></div>
      <div className={styles.ModalCard}>
        <span className={styles.Title}>{title}</span>
        <span className={styles.Subtitle}>{subtitle}</span>
        <span>{Array.isArray(authors) ? authors.join(", ") : authors}</span>
        <div className={styles.ImageDescriptionContainer}>
          <div>
            <img className={styles.Image} src={image} alt="" />
          </div>
          <div>
            <p className={styles.Description}>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoModal;
