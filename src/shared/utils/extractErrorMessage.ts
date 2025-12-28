import { RequestFailure, ProcessedError } from "@/shared/types";

/**
 * Recursively extracts the first string message from a potentially nested error structure
 */
const getFirstStringValue = (value: unknown): string | null => {
	if (typeof value === "string") {
		return value;
	}
	if (Array.isArray(value)) {
		for (const item of value) {
			const result = getFirstStringValue(item);
			if (result) return result;
		}
	}
	if (typeof value === "object" && value !== null) {
		for (const val of Object.values(value)) {
			const result = getFirstStringValue(val);
			if (result) return result;
		}
	}
	return null;
};

export const extractErrorMessage = (error: RequestFailure): ProcessedError => {
	let errorMessage = "An error occurred";

	if (error && typeof error === "object" && "data" in error && error !== null) {
		const message = error?.data?.message;
		if (typeof message === "string") {
			errorMessage = message;
		} else if (typeof message === "object" && message !== null) {
			// Recursively find the first string value to ensure we always get a string
			const extractedMessage = getFirstStringValue(message);
			if (extractedMessage) {
				errorMessage = extractedMessage;
			}
		}
	}

	return { data: { message: errorMessage, status: "error" } };
};
