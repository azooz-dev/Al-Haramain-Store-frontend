import { createApi } from "@reduxjs/toolkit/query/react";
import { CreatePaymentIntentRequest, CreatePaymentIntentResponse } from "../types";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { RequestFailure } from "@/shared/types";
import { baseQueryWithReauth } from "@/shared/api/baseQuery";

export const stripeApi = createApi({
	reducerPath: "stripeApi",
	baseQuery: baseQueryWithReauth,
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
