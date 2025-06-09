import { Button } from "./button";
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

describe("Button", () => {
  test("renders with default variant and size", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: "Click me" });

    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("bg-primary");
    expect(btn).toHaveClass("h-9");
  });

  test("renders with destructive variant and lg size", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Delete" });

    expect(btn).toHaveClass("bg-destructive");
    expect(btn).toHaveClass("h-10");
  });

  test("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Click" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>,
    );

    const btn = screen.getByRole("button", { name: "Disabled" });
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("renders as child using Slot", () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveAttribute("data-slot", "button");
  });
});
