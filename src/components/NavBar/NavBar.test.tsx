import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter, Router } from "react-router-dom";
import configureStore from "redux-mock-store";
import NavBar from "./NavBar";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";

const mockStore = configureStore([]);

describe("NavBar component", () => {
  test("renders all links", () => {
    const store = mockStore({
      favourites: { value: [] },
      reviews: { value: [] },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Favourites/i)).toBeInTheDocument();
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
  });

  test("shows correct number of favourites and reviews", () => {
    const store = mockStore({
      favourites: { value: [1, 2, 3] },
      reviews: { value: [1, 2] },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <NavBar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/\(3\)/i)).toBeInTheDocument();
    expect(screen.getByText(/\(2\)/i)).toBeInTheDocument();
  });
});
