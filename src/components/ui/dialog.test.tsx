import { describe, test, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./dialog";

describe("Dialog", () => {
  test("opens and closes the dialog", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription>Test description</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Open Dialog"));
    expect(await screen.findByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() =>
      expect(screen.queryByText("Test Title")).not.toBeInTheDocument(),
    );
  });
});
