/**
 * Smoke test to verify Jest and testing infrastructure is working
 */

describe("Test Infrastructure", () => {
  describe("Jest Setup", () => {
    it("should run tests successfully", () => {
      expect(true).toBe(true);
    });

    it("should have access to jest-dom matchers", () => {
      const element = document.createElement("div");
      element.textContent = "Hello";
      document.body.appendChild(element);

      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent("Hello");

      document.body.removeChild(element);
    });
  });

  describe("Environment Mocks", () => {
    it("should have matchMedia mocked", () => {
      expect(window.matchMedia).toBeDefined();
      expect(typeof window.matchMedia).toBe("function");
    });

    it("should have ResizeObserver mocked", () => {
      expect(global.ResizeObserver).toBeDefined();
    });

    it("should have IntersectionObserver mocked", () => {
      expect(global.IntersectionObserver).toBeDefined();
    });
  });
});
