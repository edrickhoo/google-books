const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

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

interface fetchBooksBySearchInputResponse {
  kind: string;
  totalItems: number;
  items: organisedBooksData[];
}

export const fetchBooksBySearchInput = async (
  input: string
): Promise<fetchBooksBySearchInputResponse> => {
  const res = await fetch(BASE_URL + `?q=${input || ""}`);
  const data = await res.json();

  const organisedBooks = data?.items?.map((item: booksApiResponse) => {
    return {
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publishedDate: item.volumeInfo.publishedDate,
      subtitle: item.volumeInfo.subtitle,
      image: item.volumeInfo?.imageLinks?.thumbnail,
      description: item.volumeInfo.description,
    };
  });

  const organisedData: fetchBooksBySearchInputResponse = {
    ...data,
    items: organisedBooks,
  };

  return organisedData;
};
