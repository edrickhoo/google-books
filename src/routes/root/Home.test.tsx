import {
  getByText,
  render,
  renderHook,
  RenderHookResult,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  fetchBooksBySearchInput,
  organisedBooksData,
} from "../../api/google-books-api";
import { Provider } from "react-redux";
import { store } from "../../store";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  UseQueryResult,
} from "react-query";
import { ReactNode } from "react";
import "@testing-library/jest-dom";
import Home from "./Home";
import React from "react";
import { useBooksQuery } from "../../queryHooks/booksQuery";
import axios, { AxiosError } from "axios";
import * as ReactQuery from "react-query";

jest.mock("../../queryHooks/booksQuery");

const booksDataMock = useBooksQuery as jest.Mock;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </Provider>
);

describe("Home", () => {
  it("should render books data passed into component", async () => {
    const axiosResponse = [
      {
        id: "15",
        title: "Harry",
        authors: ["Potter"],
        publishedDate: "2022-03-17",
        subtitle: "Stone",
        image: "www.hello.com",
        description: "Desc",
      },
      {
        id: "11",
        title: "Bugs",
        authors: ["Robert"],
        publishedDate: "2021-05-19",
        subtitle: "2",
        image: "www.test.com",
        description: "Desccription",
      },
    ];

    booksDataMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { kind: "test", totalItems: 15, items: axiosResponse },
      refetch: jest.fn(),
    });

    render(<Home />, { wrapper });

    expect(screen.getByText(/Harry/i)).toBeInTheDocument();
    expect(screen.getByText(/Potter/i)).toBeInTheDocument();
    expect(screen.getByText("Bugs")).toBeInTheDocument();
    expect(screen.getByText(/Robert/i)).toBeInTheDocument();
    expect(screen.getByText("2021-05-19")).toBeInTheDocument();
  });

  it("should render error when error occurs", async () => {
    booksDataMock.mockReturnValue({
      isLoading: false,
      error: { message: "error" } as AxiosError,
      data: [],
      refetch: jest.fn(),
    });

    render(<Home />, { wrapper });
    screen.logTestingPlaygroundURL();
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it("should render error when error occurs", async () => {
    booksDataMock.mockReturnValue({
      isLoading: true,
      error: false,
      data: [],
      refetch: jest.fn(),
    });

    render(<Home />, { wrapper });
    screen.logTestingPlaygroundURL();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("refetch on search", async () => {
    render(<Home />, { wrapper });
    screen.logTestingPlaygroundURL();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
