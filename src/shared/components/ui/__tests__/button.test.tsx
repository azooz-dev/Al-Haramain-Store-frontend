/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  describe("rendering", () => {
    it("should render button with text", () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    it("should render with data-slot attribute", () => {
      render(<Button>Test</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
    });
  });

  describe("variants", () => {
    it("should apply default variant classes", () => {
      render(<Button variant="default">Default</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary");
    });

    it("should apply destructive variant classes", () => {
      render(<Button variant="destructive">Delete</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-destructive");
    });

    it("should apply outline variant classes", () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("border");
      expect(button).toHaveClass("bg-background");
    });

    it("should apply ghost variant classes", () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-accent");
    });

    it("should apply link variant classes", () => {
      render(<Button variant="link">Link</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-primary");
      expect(button).toHaveClass("underline-offset-4");
    });
  });

  describe("sizes", () => {
    it("should apply default size classes", () => {
      render(<Button size="default">Default</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-9");
    });

    it("should apply small size classes", () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-8");
    });

    it("should apply large size classes", () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
    });

    it("should apply icon size classes", () => {
      render(<Button size="icon">🔍</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("size-9");
    });
  });

  describe("disabled state", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:opacity-50");
    });
  });

  describe("click handling", () => {
    it("should call onClick handler when clicked", () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      );

      fireEvent.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("custom className", () => {
    it("should merge custom className with default classes", () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("inline-flex"); // default class
    });
  });

  describe("asChild prop", () => {
    it("should render as button by default", () => {
      render(<Button>Test</Button>);

      expect(screen.getByRole("button").tagName).toBe("BUTTON");
    });
  });

  describe("type attribute", () => {
    it("should accept type prop", () => {
      render(<Button type="submit">Submit</Button>);

      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });
  });
});
