import { organisedBooksData } from "../../api/google-books-api";
import { BsBookmarkHeart } from "react-icons/bs";
import { MdRateReview } from "react-icons/md";
import { BiDetail } from "react-icons/bi";
import { useAppDispatch } from "../../hooks";
import { toggle } from "../../redux/favourites";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import styles from "./TableEntry.module.scss";
import { useNavigate } from "react-router-dom";

interface Props {
  book: organisedBooksData;
  handleOpenModal: (book: organisedBooksData) => void;
}
const TableEntry = ({ book, handleOpenModal }: Props) => {
  const navigate = useNavigate();
  const faviourites = useSelector((state: RootState) => state.favourites.value);
  const reviews = useSelector((state: RootState) => state.reviews.value);
  const dispatch = useAppDispatch();

  return (
    <tr key={book.id}>
      <td className={styles.Title}>{book.title}</td>
      <td className={styles.Authors}>
        {Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}
      </td>
      <td>{book.publishedDate}</td>
      <td>
        <span
          className={styles.MoreDetails}
          onClick={() => {
            handleOpenModal(book);
          }}
        >
          <BiDetail size={24} />
        </span>
      </td>
      <td className={styles.TableData}>
        <button
          className={`${styles.Icon} ${
            faviourites.find((item) => item.id === book.id) && styles.IconActive
          }`}
          onClick={() => dispatch(toggle(book))}
        >
          <BsBookmarkHeart size={16} />
        </button>
        <button
          onClick={() => navigate(`/review/${book.id}`)}
          className={`${styles.Icon} ${
            reviews.find((item) => item?.book?.id === book.id) &&
            styles.IconActive
          }`}
        >
          <MdRateReview size={16} />
        </button>
      </td>
    </tr>
  );
};

export default TableEntry;
