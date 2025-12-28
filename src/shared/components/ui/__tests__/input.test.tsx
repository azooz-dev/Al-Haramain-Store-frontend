/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../input";

describe("Input", () => {
  describe("rendering", () => {
    it("should render input element", () => {
      render(<Input placeholder="Enter text" />);

      expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
    });

    it("should render with data-slot attribute", () => {
      render(<Input data-testid="test-input" />);

      expect(screen.getByTestId("test-input")).toHaveAttribute("data-slot", "input");
    });
  });

  describe("type variants", () => {
    it("should render input without type when not specified", () => {
      render(<Input data-testid="input" />);

      // Input component passes through type prop, no default
      expect(screen.getByTestId("input").tagName).toBe("INPUT");
    });

    it("should render password input", () => {
      render(<Input type="password" data-testid="input" />);

      expect(screen.getByTestId("input")).toHaveAttribute("type", "password");
    });

    it("should render email input", () => {
      render(<Input type="email" data-testid="input" />);

      expect(screen.getByTestId("input")).toHaveAttribute("type", "email");
    });

    it("should render number input", () => {
      render(<Input type="number" data-testid="input" />);

      expect(screen.getByTestId("input")).toHaveAttribute("type", "number");
    });
  });

  describe("styling", () => {
    it("should have default styling classes", () => {
      render(<Input data-testid="input" />);

      const input = screen.getByTestId("input");
      expect(input).toHaveClass("flex");
      expect(input).toHaveClass("h-9");
      expect(input).toHaveClass("w-full");
      expect(input).toHaveClass("rounded-md");
    });

    it("should merge custom className", () => {
      render(<Input className="custom-class" data-testid="input" />);

      const input = screen.getByTestId("input");
      expect(input).toHaveClass("custom-class");
      expect(input).toHaveClass("flex"); // default class still present
    });
  });

  describe("disabled state", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Input disabled data-testid="input" />);

      const input = screen.getByTestId("input");
      expect(input).toBeDisabled();
      expect(input).toHaveClass("disabled:opacity-50");
    });
  });

  describe("user interaction", () => {
    it("should call onChange when value changes", () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} data-testid="input" />);

      fireEvent.change(screen.getByTestId("input"), { target: { value: "test" } });

      expect(handleChange).toHaveBeenCalled();
    });

    it("should update value on user input", () => {
      render(<Input data-testid="input" />);

      const input = screen.getByTestId("input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "hello world" } });

      expect(input.value).toBe("hello world");
    });

    it("should call onFocus and onBlur", () => {
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      render(<Input onFocus={handleFocus} onBlur={handleBlur} data-testid="input" />);

      const input = screen.getByTestId("input");
      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalled();

      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("should support aria-label", () => {
      render(<Input aria-label="Search field" data-testid="input" />);

      expect(screen.getByTestId("input")).toHaveAttribute("aria-label", "Search field");
    });

    it("should support aria-invalid for error state", () => {
      render(<Input aria-invalid="true" data-testid="input" />);

      expect(screen.getByTestId("input")).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("placeholder", () => {
    it("should display placeholder text", () => {
      render(<Input placeholder="Enter your email" />);

      expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    });
  });
});
