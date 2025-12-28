import { cn } from "../utils";

describe("cn (class name utility)", () => {
  describe("basic functionality", () => {
    it("should merge simple class names", () => {
      const result = cn("class1", "class2");

      expect(result).toBe("class1 class2");
    });

    it("should handle single class name", () => {
      const result = cn("single-class");

      expect(result).toBe("single-class");
    });

    it("should handle empty inputs", () => {
      const result = cn();

      expect(result).toBe("");
    });
  });

  describe("conditional classes", () => {
    it("should filter out falsy values", () => {
      const result = cn("always", false && "never", "also-always");

      expect(result).toBe("always also-always");
    });

    it("should handle undefined values", () => {
      const result = cn("class1", undefined, "class2");

      expect(result).toBe("class1 class2");
    });

    it("should handle null values", () => {
      const result = cn("class1", null, "class2");

      expect(result).toBe("class1 class2");
    });

    it("should handle boolean conditions", () => {
      const isActive = true;
      const isDisabled = false;

      const result = cn("base", isActive && "active", isDisabled && "disabled");

      expect(result).toBe("base active");
    });
  });

  describe("Tailwind class merging", () => {
    it("should merge conflicting Tailwind classes (last wins)", () => {
      const result = cn("p-4", "p-8");

      expect(result).toBe("p-8");
    });

    it("should merge conflicting color classes", () => {
      const result = cn("bg-red-500", "bg-blue-500");

      expect(result).toBe("bg-blue-500");
    });

    it("should merge conflicting text colors", () => {
      const result = cn("text-white", "text-black");

      expect(result).toBe("text-black");
    });

    it("should not merge non-conflicting classes", () => {
      const result = cn("p-4", "m-4");

      expect(result).toContain("p-4");
      expect(result).toContain("m-4");
    });

    it("should handle responsive variants", () => {
      const result = cn("md:p-4", "md:p-8");

      expect(result).toBe("md:p-8");
    });
  });

  describe("object syntax", () => {
    it("should handle object with boolean values", () => {
      const result = cn({
        "class-a": true,
        "class-b": false,
        "class-c": true,
      });

      expect(result).toContain("class-a");
      expect(result).not.toContain("class-b");
      expect(result).toContain("class-c");
    });
  });

  describe("array syntax", () => {
    it("should handle arrays of class names", () => {
      const result = cn(["class1", "class2"], "class3");

      expect(result).toContain("class1");
      expect(result).toContain("class2");
      expect(result).toContain("class3");
    });
  });
});
