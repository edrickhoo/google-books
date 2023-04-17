import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  fetchBooksBySearchInput,
  organisedBooksData,
} from "../../api/google-books-api";
import MoreInfoModal from "../../components/MoreInfoModal/MoreInfoModal";

export default function Root() {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState<string>("pokemon");
  const [toggleMoreInfo, setToggleMoreInfo] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<organisedBooksData | null>(
    null
  );

  const {
    isLoading,
    error,
    data: booksData,
    isRefetching,
    refetch,
  } = useQuery("booksData", () => fetchBooksBySearchInput(searchText));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("fire");
    refetch();
  };

  const closeMoreInfoModal = () => {
    setSelectedBook(null);
    setToggleMoreInfo(false);
  };

  useEffect(() => {
    console.log({ booksData });
  }, [booksData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button>{isRefetching ? "Loading.." : "Search"}</button>
        </form>
      </header>
      {/* book title, authors, and published date. */}
      <main>
        <h3>Searching for: </h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Published Date</th>
              <th>More Details</th>
            </tr>
          </thead>

          <tbody>
            {booksData?.items?.map((book: organisedBooksData, idx: number) => {
              return (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>
                    {Array.isArray(book.authors)
                      ? book.authors.join(", ")
                      : book.authors}
                  </td>
                  <td>{book.publishedDate}</td>
                  <td>
                    <span
                      onClick={() => {
                        setSelectedBook(book);
                        setToggleMoreInfo(true);
                      }}
                    >
                      Link
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {toggleMoreInfo && selectedBook && (
          <MoreInfoModal
            book={selectedBook}
            closeMoreInfoModal={closeMoreInfoModal}
          />
        )}
      </main>
    </>
  );
}
