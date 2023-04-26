import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { store } from "../../store";
import TableEntry from "./TableEntry";
import { organisedBooksData } from "../../api/google-books-api";
import { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <table>
      <tbody>{children}</tbody>
    </table>
  </Provider>
);

describe("MoreInfoModal Component Tests", () => {
  const mockBook: organisedBooksData = {
    id: "16",
    title: "Harry",
    authors: ["Potter"],
    publishedDate: "2022-03-17",
    subtitle: "Stone",
    image: "www.hello.com",
    description: "Desc",
  };

  it("should render book data passed into component", async () => {
    const handleOpenModal = jest.fn(() => {});
    render(<TableEntry book={mockBook} handleOpenModal={handleOpenModal} />, {
      wrapper,
    });
    expect(screen.getByText(/Harry/i)).toBeInTheDocument;
    expect(screen.getByText(/Potter/i)).toBeInTheDocument();
    expect(screen.getByText("2022-03-17")).toBeInTheDocument();
  });

  it("should fire onclick handleOpenModal function when Link of card is clicked", async () => {
    const handleOpenModal = jest.fn(() => {});
    render(<TableEntry book={mockBook} handleOpenModal={handleOpenModal} />, {
      wrapper,
    });

    const link = screen.getByText(/Link/i);
    await userEvent.click(link);
    expect(handleOpenModal).toBeCalled();
    await userEvent.click(link);
    expect(handleOpenModal).toBeCalledTimes(2);
  });
});
