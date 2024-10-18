// Task1.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import { Task1 } from "./component/Practice";
import "@testing-library/jest-dom"; // for extended matchers like "toBeInTheDocument"

// Tests for the Task1 component
describe("Task1 Component", () => {
  test("renders Task 1 (counter) heading", () => {
    render(<Task1 />);
    expect(screen.getByText("Task 1 (counter)")).toBeInTheDocument();
  });

  test("initially displays count as 0", () => {
    render(<Task1 />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("0");
  });

  test("increments the count by 5 when the Increment button is clicked", () => {
    render(<Task1 />);
    const incrementButton = screen.getByText("Increment");
    fireEvent.click(incrementButton);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("5");
  });

  test("decrements the count by 5 when the Decrement button is clicked", () => {
    render(<Task1 />);
    const decrementButton = screen.getByText("Decrement");
    fireEvent.click(decrementButton);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("-5");
  });
});
