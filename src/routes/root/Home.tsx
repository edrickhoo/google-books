import { AxiosError } from "axios";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchBooksBySearchInputResponse,
  organisedBooksData,
} from "../../api/google-books-api";
import MoreInfoModal from "../../components/MoreInfoModal/MoreInfoModal";
import NavBar from "../../components/NavBar/NavBar";
import TableEntry from "../../components/TableEntry/TableEntry";
import { useAppDispatch } from "../../hooks";
import { useBooksQuery } from "../../queryHooks/booksQuery";
import { RootState } from "../../store";
import styles from "./Home.module.scss";
import Footer from "../../components/Footer/Footer";

interface sortType {
  field: keyof organisedBooksData;
  type: string;
}

export default function Home() {
  const [searchText, setSearchText] = useState<string>("flowers");
  const [searchedText, setSearchedText] = useState<string>("");
  const [toggleMoreInfo, setToggleMoreInfo] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [selectedBook, setSelectedBook] = useState<organisedBooksData | null>(
    null
  );

  const [sort, setSort] = useState<sortType>({
    field: "title",
    type: "asc",
  });
  const [recentSearch, setRecentSearch] = useState<string[]>([]);
  const [clickSearch, setClickSearch] = useState<string>("");

  const faviourites = useSelector((state: RootState) => state.favourites.value);
  const dispatch = useAppDispatch();

  const pageInput = useRef<HTMLInputElement>(null);

  const {
    isLoading,
    error,
    data: booksData,
    isRefetching,
    refetch,
  } = useBooksQuery(searchText, pageIndex);

  useEffect(() => {
    refetch();
  }, [clickSearch, pageIndex]);

  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    history && setRecentSearch(JSON.parse(history));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchedText(searchText);
    setPageIndex(1);
    await refetch();
    addSeachToHistory(searchText);
  };

  const handleOpenModal = (book: organisedBooksData) => {
    setSelectedBook(book);
    setToggleMoreInfo(true);
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

  const sortBooks = (
    books: fetchBooksBySearchInputResponse,
    sort: sortType
  ) => {
    let dataToRender: organisedBooksData[] = [];
    if (sort.field) {
      if (sort.type === "asc") {
        dataToRender = books?.items?.sort((a, b) => {
          if (a[sort.field] < b[sort.field]) {
            return -1;
          }
          if (a[sort.field] > b[sort.field]) {
            return 1;
          }
          return 0;
        });
      } else {
        dataToRender = books?.items?.sort((a, b) => {
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
    return dataToRender;
  };

  const RenderBooks = () => {
    if (booksData === undefined) {
      return <div>No Data found</div>;
    }
    let dataToRender: organisedBooksData[] = sortBooks(booksData, sort);

    return (
      <>
        {dataToRender?.map((book: organisedBooksData, idx: number) => {
          return (
            <TableEntry
              key={book.id}
              book={book}
              handleOpenModal={handleOpenModal}
            />
          );
        })}
      </>
    );
  };

  const handlePageNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      Number(pageInput?.current?.value) > 0 &&
        setPageIndex(Number(pageInput?.current?.value));
      pageInput.current!.value = "";
    }
  };

  return (
    <div className={styles.PageContainer}>
      <NavBar />
      <main className={styles.MainContainer}>
        <div className={styles.Wrapper}>
          <div className={styles.SearchContainer}>
            <form onSubmit={handleSubmit}>
              <input
                className={styles.SearchInput}
                data-testid="searchInput"
                type="text"
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                value={searchText}
              />
              <button
                className={`${styles.PrimaryBtn} ${styles.SearchBtn}`}
                data-testid="searchBtn"
                disabled={isRefetching || isLoading}
              >
                {isRefetching || isLoading ? "Loading.." : "Search"}
              </button>
            </form>
            {recentSearch.length > 0 && (
              <div className={styles.RecentSearchContainer}>
                <span>Recent Searches:</span>
                {recentSearch.map((search, index) => (
                  <div
                    title={search}
                    className={styles.RecentSearch}
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
          </div>
          <div
            className={`${styles.SearchingText} ${
              !searchedText && styles.SearchingTextOff
            }`}
          >
            Searching for: {searchedText}
          </div>
          {error ? <div>Error occured. Please try again</div> : null}
          {error instanceof AxiosError && (
            <div>
              Error: {error.response?.data.error.message || "Erorr has occured"}
            </div>
          )}
          <div className={styles.DisplayText}>Displaying - 20 </div>
          <div className={styles.TableContainer}>
            <table className={styles.Table}>
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
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>{booksData && <RenderBooks />}</tbody>
            </table>
          </div>
          <div className={styles.PageNavContainer}>
            <button
              className={styles.PrimaryBtn}
              data-testid="prevBtn"
              disabled={isRefetching}
              onClick={() => pageIndex > 1 && setPageIndex((prev) => prev - 1)}
            >
              Prev
            </button>
            <input
              className={styles.PageNumInput}
              data-testid="pageInput"
              ref={pageInput}
              onKeyDown={handlePageNumber}
              placeholder={pageIndex.toString()}
              type="number"
              min={1}
            />
            <button
              className={styles.PrimaryBtn}
              data-testid="nextBtn"
              disabled={isRefetching}
              onClick={() => setPageIndex((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
          {toggleMoreInfo && selectedBook && (
            <MoreInfoModal
              book={selectedBook}
              closeMoreInfoModal={closeMoreInfoModal}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
