import { describe, test, expect } from "vitest";
import { Input } from "./input";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Input", () => {
  test("renders the input element", () => {
    render(<Input aria-label="name" />);
    const input = screen.getByRole("textbox", { name: /name/i });

    expect(input).toBeInTheDocument();
  });

  test("accepts and renders a default value", () => {
    render(<Input aria-label="email" defaultValue="example@test.com" />);
    const input = screen.getByRole("textbox", { name: /email/i });

    expect(input).toHaveValue("example@test.com");
  });

  test("updates value when typed (uncontrolled)", () => {
    render(<Input aria-label="username" />);
    const input = screen.getByRole("textbox", { name: /username/i });

    fireEvent.change(input, { target: { value: "john_doe" } });

    expect(input).toHaveValue("john_doe");
  });

  test("applies custom class name", () => {
    render(<Input aria-label="field" className="custom-class" />);
    const input = screen.getByRole("textbox", { name: /field/i });

    expect(input).toHaveClass("custom-class");
  });

  test("respects type prop", () => {
    render(<Input type="password" aria-label="password" />);
    const input = screen.getByLabelText("password");

    expect(input).toHaveAttribute("type", "password");
  });

  test("can be disabled", () => {
    render(<Input disabled aria-label="disabled-input" />);
    const input = screen.getByLabelText("disabled-input");

    expect(input).toBeDisabled();
  });

  test("handles controlled value", () => {
    const value = "controlled";
    render(<Input value={value} readOnly aria-label="controlled-input" />);
    const input = screen.getByLabelText("controlled-input");

    expect(input).toHaveValue(value);
  });
});
