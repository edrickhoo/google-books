import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import "@testing-library/jest-dom";

describe("Footer component", () => {
  test("renders name correctly", () => {
    const { getByText } = render(<Footer />);
    screen.logTestingPlaygroundURL();
    const nameElement = getByText(/edric khoo/i);
    console.log(nameElement);
    expect(nameElement).toBeInTheDocument();
  });

  test("renders two lines", () => {
    const { getAllByTestId } = render(<Footer />);
    const lines = getAllByTestId("line");
    expect(lines.length).toBe(2);
  });
});
