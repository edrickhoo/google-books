import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { organisedBooksData } from "../../api/google-books-api";
import MoreInfoModal from "../../components/MoreInfoModal/MoreInfoModal";
import NavBar from "../../components/NavBar/NavBar";
import TableEntry from "../../components/TableEntry/TableEntry";
import { useAppDispatch } from "../../hooks";
import { RootState } from "../../store";
import styles from "../root/Home.module.scss";
import Footer from "../../components/Footer/Footer";

interface sortType {
  field: keyof organisedBooksData;
  type: string;
}

export default function Favouritespage() {
  const [searchText, setSearchText] = useState<string>("");
  const [searchedText, setSearchedText] = useState<string>("");
  const [toggleMoreInfo, setToggleMoreInfo] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [booksData, setBooksData] = useState<organisedBooksData[]>([]);
  const [selectedBook, setSelectedBook] = useState<organisedBooksData | null>(
    null
  );
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const [sort, setSort] = useState<sortType>({
    field: "title",
    type: "asc",
  });
  const [recentSearch, setRecentSearch] = useState<string[]>([]);

  const faviourites = useSelector((state: RootState) => state.favourites.value);
  const dispatch = useAppDispatch();

  const pageInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    history && setRecentSearch(JSON.parse(history));
  }, []);

  useEffect(() => {
    faviourites && setBooksData(faviourites);
  }, [faviourites]);

  useEffect(() => {
    let searchTextFiletered = filterBySearchText(faviourites);
    setSearchedText(searchText);
    setBooksData(
      searchTextFiletered.slice((pageIndex - 1) * 10, (pageIndex - 1) * 20 + 10)
    );
  }, [pageIndex]);

  const addSeachToHistory = (word: string) => {
    if (word !== "") {
      let copy = [...recentSearch];
      if (copy.length > 4) {
        copy.pop();
        copy.unshift(word);
      } else {
        copy.unshift(word);
      }
      setRecentSearch(copy);
      localStorage.setItem("searchHistory", JSON.stringify(copy));
    }
  };

  const filterBySearchText = (data: organisedBooksData[]) => {
    return data.filter(
      (item) =>
        item?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.subtitle?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const searchFavourites = (searchText: string) => {
    setBooksData(
      faviourites
        .filter(
          (item) =>
            item?.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            item?.subtitle?.toLowerCase().includes(searchText.toLowerCase())
        )
        .slice((pageIndex - 1) * 20, (pageIndex - 1) * 20 + 10)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchedText(searchText);
    setPageIndex(1);
    addSeachToHistory(searchText);
    searchFavourites(searchText);
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

  const sortBooks = (books: organisedBooksData[], sort: sortType) => {
    let dataToRender: organisedBooksData[] = [];
    let copy = [...books];
    if (sort.field) {
      if (sort.type === "asc") {
        dataToRender = copy?.sort((a, b) => {
          if (a[sort.field] < b[sort.field]) {
            return -1;
          }
          if (a[sort.field] > b[sort.field]) {
            return 1;
          }
          return 0;
        });
      } else {
        dataToRender = copy?.sort((a, b) => {
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
                disabled={searchLoading}
              >
                {searchLoading ? "Loading.." : "Search"}
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
                      searchFavourites(search);
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
          <div className={styles.DisplayText}>Displaying - 10 </div>
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
                  <th>More Details</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {!booksData && (
                  <tr>
                    <td>No books currently favourited</td>
                  </tr>
                )}
                {booksData && booksData.length < 1 && (
                  <tr>
                    <td>No more faviourited books</td>
                  </tr>
                )}
                {booksData && booksData.length > 0 && <RenderBooks />}
              </tbody>
            </table>
          </div>

          <div className={styles.PageNavContainer}>
            <button
              className={styles.PrimaryBtn}
              data-testid="prevBtn"
              disabled={searchLoading}
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
              disabled={searchLoading}
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
