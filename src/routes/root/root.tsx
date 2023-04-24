import { AxiosError } from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import {
  fetchBooksBySearchInput,
  fetchBooksBySearchInputResponse,
  organisedBooksData,
} from "../../api/google-books-api";
import MoreInfoModal from "../../components/MoreInfoModal/MoreInfoModal";
import { useAppDispatch } from "../../hooks";
import { RootState } from "../../store";
import styles from "./root.module.scss";

export default function Root() {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState<string>("flowers");
  const [searchedText, setSearchedText] = useState<string>("");
  const [toggleMoreInfo, setToggleMoreInfo] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [selectedBook, setSelectedBook] = useState<organisedBooksData | null>(
    null
  );
  const faviourites = useSelector((state: RootState) => state.favourites.value);
  const dispatch = useAppDispatch();

  const pageInput = React.useRef<HTMLInputElement>(null);
  interface sortType {
    field: keyof organisedBooksData;
    type: string;
  }
  const [sort, setSort] = useState<sortType>({
    field: "title",
    type: "asc",
  });
  const [recentSearch, setRecentSearch] = useState<string[]>([]);
  const [clickSearch, setClickSearch] = useState("");

  const {
    isLoading,
    error,
    data: booksData,
    isRefetching,
    refetch,
  } = useQuery(
    "booksData",
    () => fetchBooksBySearchInput(searchText, pageIndex),
    {
      enabled: false,
      onError(err) {
        err instanceof AxiosError &&
          console.log(err.response?.data.error.message);
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [clickSearch, pageIndex]);

  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    history && setRecentSearch(JSON.parse(history));
    console.log(faviourites, " ^-^");
  }, []);

  const addSeachToHistory = (word: string) => {
    let copy = [...recentSearch];
    if (copy.length > 4) {
      copy.pop();
      copy.unshift(word);
    } else {
      copy.unshift(word);
    }
    setRecentSearch(copy);
    localStorage.setItem("searchHistory", JSON.stringify(copy));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchedText(searchText);
    setPageIndex(1);
    refetch();
    addSeachToHistory(searchText);
  };

  const closeMoreInfoModal = () => {
    setSelectedBook(null);
    setToggleMoreInfo(false);
  };

  const toggleSort = (field: keyof organisedBooksData) => {
    if (sort.field !== field) {
      setSort({
        field: field,
        type: "asc",
      });
    } else {
      setSort({ ...sort, type: sort.type === "asc" ? "desc" : "asc" });
    }
  };

  const renderBooks = () => {
    if (booksData === undefined) {
      return;
    }
    let dataToRender: organisedBooksData[] = booksData?.items;
    if (sort.field) {
      if (sort.type === "asc") {
        dataToRender = dataToRender?.sort((a, b) => {
          if (a[sort.field] < b[sort.field]) {
            return -1;
          }
          if (a[sort.field] > b[sort.field]) {
            return 1;
          }
          return 0;
        });
      } else {
        dataToRender = dataToRender?.sort((a, b) => {
          if (a[sort.field] < b[sort.field]) {
            return 1;
          }
          if (a[sort.field] > b[sort.field]) {
            return -1;
          }
          return 0;
        });
      }
    }
    return dataToRender?.map((book: organisedBooksData, idx: number) => {
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
              className={styles.Link}
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
    });
  };

  const handlePageNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      Number(pageInput?.current?.value) > 0 &&
        setPageIndex(Number(pageInput?.current?.value));
      pageInput.current!.value = "";
    }
  };

  return (
    <>
      <header>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            value={searchText}
          />
          <button>{isRefetching || isLoading ? "Loading.." : "Search"}</button>
        </form>
      </header>
      {/* book title, authors, and published date. */}
      <main>
        {recentSearch.length > 0 && (
          <div>
            <span>Recent: Searches</span>
            {recentSearch.map((search, index) => (
              <div
                onClick={() => {
                  setSearchText(search);
                  setClickSearch(search);
                  setPageIndex(1);
                }}
                key={index}
              >
                {search}
              </div>
            ))}
          </div>
        )}

        <div
          className={`${styles.SearchingText} ${
            !searchedText && styles.SearchingTextOff
          }`}
        >
          Searching for: {searchedText}
        </div>
        {error instanceof AxiosError && (
          <div>Error: {error.response?.data.error.message} </div>
        )}
        <table>
          <thead>
            <tr>
              <th
                className={`${
                  sort.field === "title" &&
                  (sort.type === "asc"
                    ? styles.SortActiveAsc
                    : styles.SortActiveDesc)
                }`}
                onClick={() => toggleSort("title")}
              >
                Title
              </th>
              <th
                className={`${
                  sort.field === "authors" &&
                  (sort.type === "asc"
                    ? styles.SortActiveAsc
                    : styles.SortActiveDesc)
                }`}
                onClick={() => toggleSort("authors")}
              >
                Authors
              </th>
              <th
                className={`${
                  sort.field === "publishedDate" &&
                  (sort.type === "asc"
                    ? styles.SortActiveAsc
                    : styles.SortActiveDesc)
                }`}
                onClick={() => toggleSort("publishedDate")}
              >
                Published Date
              </th>
              <th>More Details</th>
            </tr>
          </thead>

          <tbody>{booksData && renderBooks()}</tbody>
        </table>
        <div>
          <button
            onClick={() => pageIndex > 1 && setPageIndex((prev) => prev - 1)}
          >
            Prev
          </button>
          <input
            ref={pageInput}
            onKeyDown={handlePageNumber}
            placeholder={pageIndex.toString()}
            type="number"
            min={1}
          />
          <button onClick={() => setPageIndex((prev) => prev + 1)}>Next</button>
        </div>
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
