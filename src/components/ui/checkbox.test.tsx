import { Checkbox } from "./checkbox";
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Checkbox", () => {
  test("renders unchecked checkbox by default", () => {
    render(<Checkbox aria-label="checkbox" />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  test("renders as checked when defaultChecked is true", () => {
    render(<Checkbox aria-label="checkbox" defaultChecked />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeChecked();
  });

  test("calls onCheckedChange when clicked", () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox aria-label="checkbox" onCheckedChange={onCheckedChange} />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalled();
  });

  test("applies custom className", () => {
    render(<Checkbox aria-label="checkbox" className="custom-class" />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveClass("custom-class");
  });

  test("does not allow interaction when disabled", () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="checkbox"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toBeDisabled();
  });

  test("indicator icon appears when checked", () => {
    render(<Checkbox aria-label="checkbox" defaultChecked />);
    const indicator = screen.getByTestId("check-icon");

    expect(indicator).toBeInTheDocument();
  });
});
