import { useDispatch, useSelector } from "react-redux";
import { organisedBooksData } from "../../api/google-books-api";
import styles from "./MoreInfoModal.module.scss";
import { toggle } from "../../redux/favourites";
import { RootState } from "../../store";
import { useEffect } from "react";

interface Props {
  book: organisedBooksData;
  closeMoreInfoModal: () => void;
}
const MoreInfoModal = ({ book, closeMoreInfoModal }: Props) => {
  const { title, subtitle, authors, image, description } = book;
  const favourites = useSelector((state: RootState) => state.favourites.value);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(favourites);
  }, [favourites]);
  return (
    <div>
      <div
        className={styles.ModalBackground}
        onClick={closeMoreInfoModal}
        data-testid="modalBg"
      ></div>
      <div className={styles.ModalCard}>
        <span className={styles.Title}>{title}</span>
        <button
          onClick={() => {
            dispatch(toggle(book));
          }}
        >
          ^-^
        </button>
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
