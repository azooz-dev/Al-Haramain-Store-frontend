import { RequestFailure, ProcessedError } from "@/shared/types";

export const extractErrorMessage = (error: RequestFailure): ProcessedError => {
	let errorMessage = "An error occurred";

	if (error && typeof error === "object" && "data" in error && error !== null) {
		const message = error?.data?.message;
		if (typeof message === "string") {
			errorMessage = message;
		} else if (typeof message === "object" && message !== null) {
			if (Array.isArray(message)) {
				errorMessage = message.join(", ");
			} else {
				errorMessage = Object.values(message).flat().join(", ");
			}
		}
	}

	return { data: { message: errorMessage, status: "error" } };
};
