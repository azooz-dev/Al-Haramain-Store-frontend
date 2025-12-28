import { extractErrorMessage } from "../extractErrorMessage";

describe("extractErrorMessage", () => {
  describe("with string message", () => {
    it("should extract string message directly", () => {
      const error = {
        status: 400,
        data: {
          message: "Invalid credentials",
          status: "error",
        },
      };

      const result = extractErrorMessage(error);

      expect(result).toEqual({
        data: {
          message: "Invalid credentials",
          status: "error",
        },
      });
    });
  });

  describe("with array message", () => {
    it("should extract first message from array", () => {
      const error = {
        status: 422,
        data: {
          message: ["Email is required", "Password is required"],
          status: "error",
        },
      };

      const result = extractErrorMessage(error);

      expect(result.data.message).toBe("Email is required");
      expect(result.data.status).toBe("error");
    });

    it("should handle empty array", () => {
      const error = {
        status: 422,
        data: {
          message: [],
          status: "error",
        },
      };

      const result = extractErrorMessage(error);

      expect(result.data.message).toBe("An error occurred");
    });
  });

  describe("with object message (validation errors)", () => {
    it("should extract first error from nested object", () => {
      const error = {
        status: 422,
        data: {
          message: {
            email: ["The email field is required."],
            password: ["The password field is required."],
          },
          status: "error",
        },
      };

      const result = extractErrorMessage(error);

      expect(result.data.message).toBe("The email field is required.");
    });

    it("should handle deeply nested errors", () => {
      const error = {
        status: 422,
        data: {
          message: {
            user: {
              profile: {
                name: ["Name is too short"],
              },
            },
          },
          status: "error",
        },
      };

      const result = extractErrorMessage(error);

      expect(result.data.message).toBe("Name is too short");
    });
  });

  describe("with invalid/missing data", () => {
    it("should return default message for null error", () => {
      const result = extractErrorMessage(null as unknown as { status: number; data: { message: string } });

      expect(result.data.message).toBe("An error occurred");
    });

    it("should return default message for undefined error", () => {
      const result = extractErrorMessage(undefined as unknown as { status: number; data: { message: string } });

      expect(result.data.message).toBe("An error occurred");
    });

    it("should return default message when data is missing", () => {
      const error = {
        status: 500,
      };

      const result = extractErrorMessage(error as { status: number; data: { message: string } });

      expect(result.data.message).toBe("An error occurred");
    });

    it("should return default message when message is empty object", () => {
      const error = {
        status: 422,
        data: {
          message: {},
          status: "error",
        },
      };

      const result = extractErrorMessage(error);

      expect(result.data.message).toBe("An error occurred");
    });
  });

  describe("return format", () => {
    it("should always return ProcessedError format", () => {
      const error = {
        status: 400,
        data: {
          message: "Test error",
          status: "error",
        },
      };

      const result = extractErrorMessage(error);

      expect(result).toHaveProperty("data");
      expect(result.data).toHaveProperty("message");
      expect(result.data).toHaveProperty("status", "error");
    });
  });
});
