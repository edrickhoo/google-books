import React from "react";
import { organisedBooksData } from "../../api/google-books-api";

interface Props {
  book: organisedBooksData;
  handleOpenModal: (book: organisedBooksData) => void;
}
const TableEntry = ({ book, handleOpenModal }: Props) => {
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
    </tr>
  );
};

export default TableEntry;
