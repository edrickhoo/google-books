import { useQuery } from "react-query";
import { fetchBooksBySearchInput } from "../api/google-books-api";

export const useBooksQuery = (searchText: string, pageIndex: number) => {
  const res = useQuery(
    ["booksData"],
    () => fetchBooksBySearchInput(searchText, pageIndex),
    {
      enabled: false,
    }
  );
  return res;
};
