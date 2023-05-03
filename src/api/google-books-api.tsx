import axios from "axios";
import DOMPurify from "dompurify";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

const numResults = 20;

export interface booksApiResponse {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publishedDate: string;
    subtitle: string;
    imageLinks: {
      thumbnail: string;
    };
    description: string;
  };
}

export interface organisedBooksData {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  subtitle: string;
  image: string;
  description: string;
}

export interface fetchBooksBySearchInputResponse {
  kind: string;
  totalItems: number;
  items: organisedBooksData[];
}

export const fetchBooksBySearchInput = async (
  input: string,
  pageIndex: number
): Promise<fetchBooksBySearchInputResponse> => {
  if (input === "") {
    throw new Error("Please enter something before searching");
  }
  const res = await axios.get(
    BASE_URL +
      `?q=${input || ""}&maxResults=${numResults}&startIndex=${
        pageIndex * numResults
      }`
  );
  const data = res.data;

  if (data.totalItems === 0) {
    throw new Error(`No books with ${input} was found`);
  }

  const organisedBooks = data?.items?.map((item: booksApiResponse) => {
    return {
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publishedDate: item.volumeInfo.publishedDate,
      subtitle: item.volumeInfo.subtitle,
      image:
        item.volumeInfo?.imageLinks?.thumbnail ||
        "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg",
      description:
        (item.volumeInfo.description &&
          DOMPurify.sanitize(item.volumeInfo.description)) ||
        "No description Avaliable",
    };
  });

  const organisedData: fetchBooksBySearchInputResponse = {
    ...data,
    items: organisedBooks,
  };
  return organisedData;
};

export const fetchSingleBookById = async (id: string | undefined) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  const data = res.data;

  if (data.code === 503) {
    throw new Error(`No books with ${id} was found`);
  }
  const book = {
    id: data?.id,
    title: data?.volumeInfo.title,
    authors: data?.volumeInfo.authors,
    publishedDate: data?.volumeInfo.publishedDate,
    subtitle: data?.volumeInfo.subtitle,
    image:
      data?.volumeInfo?.imageLinks?.thumbnail ||
      "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg",
    description:
      (data?.volumeInfo.description &&
        DOMPurify.sanitize(data?.volumeInfo.description)) ||
      "No description Avaliable",
  };

  return book;
};
