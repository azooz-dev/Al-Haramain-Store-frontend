import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookieValue } from "@/shared/utils/getCookieValue";
import { APP_CONFIG } from "@/shared/config/config";
import { CreatePaymentIntentRequest, CreatePaymentIntentResponse } from "../types";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { RequestFailure } from "@/shared/types";
import { RootState } from "@store/store";

const rawBaseQuery = fetchBaseQuery({
	baseUrl: APP_CONFIG.apiBaseUrl,
	credentials: "include",
	validateStatus: (response) => response.status >= 200 && response.status < 300,
	prepareHeaders: (headers) => {
		const csrfToken =
			document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
			getCookieValue("XSRF-TOKEN") ||
			getCookieValue("csrf-token");

		if (csrfToken) {
			headers.set("X-CSRF-TOKEN", csrfToken);
		}

		const authToken = localStorage.getItem("auth_token");
		if (authToken) {
			headers.set("Authorization", `Bearer ${authToken}`);
		}

		headers.set("Content-Type", "application/json");
		headers.set("Accept", "application/json");
		headers.set("X-Requested-With", "XMLHttpRequest");
		return headers;
	},
});

const baseQueryWithLocale: typeof rawBaseQuery = async (args, api, extra) => {
	const language = (api.getState() as RootState)?.ui?.language || "en";

	if (typeof args === "string") args = { url: args };
	if (typeof args === "object") {
		(args.headers = new Headers(args.headers as HeadersInit)).set("X-locale", language);
	}

	return await rawBaseQuery(args, api, extra);
};

export const stripeApi = createApi({
	reducerPath: "stripeApi",
	baseQuery: baseQueryWithLocale,
	tagTypes: ["StripePayment"],
	endpoints: (builder) => ({
		createPaymentIntent: builder.mutation<CreatePaymentIntentResponse, CreatePaymentIntentRequest>({
			query: (data) => ({
				url: "/api/payments/create-intent",
				method: "POST",
				body: data,
			}),
			transformErrorResponse: (response: unknown) => {
				return extractErrorMessage(response as RequestFailure);
			},
			invalidatesTags: ["StripePayment"],
		}),
	}),
});

export const { useCreatePaymentIntentMutation } = stripeApi;
