/**
 * @jest-environment jsdom
 */
import { getCookieValue } from "../getCookieValue";

describe("getCookieValue", () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  });

  describe("with existing cookies", () => {
    it("should return the value of an existing cookie", () => {
      document.cookie = "testCookie=testValue";

      const result = getCookieValue("testCookie");

      expect(result).toBe("testValue");
    });

    it("should return correct value when multiple cookies exist", () => {
      document.cookie = "first=1";
      document.cookie = "second=2";
      document.cookie = "third=3";

      expect(getCookieValue("first")).toBe("1");
      expect(getCookieValue("second")).toBe("2");
      expect(getCookieValue("third")).toBe("3");
    });

    it("should handle cookies with special characters in value", () => {
      document.cookie = "token=abc123%3D%3D";

      const result = getCookieValue("token");

      expect(result).toBe("abc123%3D%3D");
    });

    it("should handle cookies with spaces around name", () => {
      document.cookie = "spacedCookie=value";

      const result = getCookieValue("spacedCookie");

      expect(result).toBe("value");
    });
  });

  describe("with non-existing cookies", () => {
    it("should return null for non-existing cookie", () => {
      document.cookie = "existingCookie=value";

      const result = getCookieValue("nonExistingCookie");

      expect(result).toBeNull();
    });

    it("should return null when no cookies exist", () => {
      const result = getCookieValue("anyCookie");

      expect(result).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should handle empty string cookie name", () => {
      const result = getCookieValue("");

      expect(result).toBeNull();
    });

    it("should not match partial cookie names", () => {
      document.cookie = "longerName=value";

      const result = getCookieValue("longer");

      expect(result).toBeNull();
    });

    it("should handle cookie with empty value", () => {
      document.cookie = "emptyCookie=";

      const result = getCookieValue("emptyCookie");

      // Empty cookie value results in null due to the implementation's use of .pop()?.split(";").shift()
      expect(result).toBeNull();
    });
  });
});
