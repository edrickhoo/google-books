import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { organisedBooksData } from "../../api/google-books-api";
import MoreInfoModal from "./MoreInfoModal";
import { Provider } from "react-redux";
import { store } from "../../store";
import "@testing-library/jest-dom";

describe("MoreInfoModal Component Tests", () => {
  const mockBook: organisedBooksData = {
    id: "11",
    title: "bob",
    authors: ["Potter"],
    publishedDate: "2022-03-17",
    subtitle: "Stone",
    image: "www.hello.com",
    description: "Desc",
  };

  it("should render book data passed into component", async () => {
    const closeMoreInfoModal = jest.fn(() => {});
    render(
      <Provider store={store}>
        <MoreInfoModal
          book={mockBook}
          closeMoreInfoModal={closeMoreInfoModal}
        />
      </Provider>
    );
    expect(screen.getByText(/bob/i)).toBeInTheDocument;
    expect(screen.getByText(/Potter/i)).toBeInTheDocument();
    expect(screen.getByText("Stone")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
  });

  it("should fire onclick closeMoreInfoModal function when outside of card is pressed", async () => {
    const closeMoreInfoModal = jest.fn(() => {});
    render(
      <Provider store={store}>
        <MoreInfoModal
          book={mockBook}
          closeMoreInfoModal={closeMoreInfoModal}
        />
      </Provider>
    );

    const modalBackground = screen.getByTestId("modalBg");
    await userEvent.click(modalBackground);
    expect(closeMoreInfoModal).toBeCalled();
  });
});
