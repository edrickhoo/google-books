import React, { useEffect } from "react";
import { organisedBooksData } from "../../api/google-books-api";
import { BsBookmarkHeart } from "react-icons/bs";
import { MdRateReview } from "react-icons/md";
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
      <td>{book.title}</td>
      <td>
        {Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}
      </td>
      <td>{book.publishedDate}</td>
      <td>
        <span
          onClick={() => {
            handleOpenModal(book);
          }}
        >
          Link
        </span>
      </td>
      <td className={styles.TableData}>
        <button
          className={`${styles.Icon} ${
            faviourites.find((item) => item.id === book.id) && styles.IconActive
          }`}
          onClick={() => dispatch(toggle(book))}
        >
          <BsBookmarkHeart />
        </button>
        <button
          onClick={() => navigate(`/review/${book.id}`)}
          className={`${styles.Icon} ${
            reviews.find((item) => item?.book?.id === book.id) &&
            styles.IconActive
          }`}
        >
          <MdRateReview />
        </button>
      </td>
    </tr>
  );
};

export default TableEntry;
