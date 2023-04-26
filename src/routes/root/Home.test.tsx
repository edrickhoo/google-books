import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../../store";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode } from "react";
import "@testing-library/jest-dom";
import Home from "./Home";
import { useBooksQuery } from "../../queryHooks/booksQuery";
import { AxiosError } from "axios";
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
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it("should render error when error occurs", async () => {
    const fetchMock = jest.fn();
    booksDataMock.mockReturnValue({
      isLoading: true,
      error: false,
      data: [],
      refetch: fetchMock,
    });

    render(<Home />, { wrapper });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("refetch on search", async () => {
    const fetchMock = jest.fn();
    booksDataMock.mockReturnValue({
      isLoading: false,
      error: false,
      data: [],
      refetch: fetchMock,
    });

    render(<Home />, { wrapper });
    const searchBtn = screen.getAllByRole("button")[0];
    await userEvent.click(searchBtn);
    expect(fetchMock).toBeCalled();
  });

  it("Should search for whats inputted in text box", async () => {
    render(<Home />, { wrapper });

    const searchInput = screen.getByTestId("searchInput");
    const searchBtn = screen.getByTestId("searchBtn");
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "pokemon");
    await userEvent.click(searchBtn);
    expect(screen.getByText(/searching for: pokemon/i)).toBeInTheDocument();
  });

  it("should call refetch when click button for next and prev", async () => {
    const fetchMock = jest.fn();
    booksDataMock.mockReturnValue({
      isLoading: false,
      error: false,
      data: [],
      refetch: fetchMock,
    });
    render(<Home />, { wrapper });

    const nextBtn = screen.getByTestId("nextBtn");
    const prevBtn = screen.getByTestId("prevBtn");
    await userEvent.click(nextBtn);
    expect(fetchMock).toBeCalledTimes(2);
    await userEvent.click(prevBtn);
    expect(fetchMock).toBeCalledTimes(3);
  });

  it("should call refetch when click button for next and prev", async () => {
    const fetchMock = jest.fn();
    booksDataMock.mockReturnValue({
      isLoading: false,
      error: false,
      data: [],
      refetch: fetchMock,
    });
    render(<Home />, { wrapper });

    const nextBtn = screen.getByTestId("nextBtn");
    const prevBtn = screen.getByTestId("prevBtn");
    await userEvent.click(nextBtn);
    expect(screen.getByPlaceholderText(/2/i)).toBeInTheDocument();
    await userEvent.click(prevBtn);
    expect(screen.getByPlaceholderText(/1/i)).toBeInTheDocument();
  });

  it("should call refetch when pageInput enters input and enter is pressed", async () => {
    const fetchMock = jest.fn();
    booksDataMock.mockReturnValue({
      isLoading: false,
      error: false,
      data: [],
      refetch: fetchMock,
    });
    render(<Home />, { wrapper });
    const pageInput = screen.getByTestId("pageInput");
    await userEvent.type(pageInput, "3");
    await userEvent.type(pageInput, "{enter}");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("should change page number when new number is typed and enter is pressed", async () => {
    const fetchMock = jest.fn();
    booksDataMock.mockReturnValue({
      isLoading: false,
      error: false,
      data: [],
      refetch: fetchMock,
    });
    render(<Home />, { wrapper });
    const pageInput = screen.getByTestId("pageInput");
    await userEvent.type(pageInput, "3");
    await userEvent.type(pageInput, "{enter}");
    expect(screen.getByPlaceholderText(/3/i)).toBeInTheDocument();
  });
});
