import { useState, useCallback } from "react";
import {
	loadStripe,
	Stripe,
	StripeElements,
	StripeElement,
	StripeCardElement,
} from "@stripe/stripe-js";
import { BillingDetails, PaymentIntent } from "@stripe/stripe-js";
import { APP_CONFIG } from "@/shared/config/config";
import { useCreatePaymentIntentMutation } from "../services/stripeApi";
import { StripePaymentError, CreatePaymentIntentRequest } from "../types";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import { RequestFailure } from "@/shared/types";

interface UseStripePaymentReturn {
	stripe: Stripe | null;
	elements: StripeElements | null;
	isLoading: boolean;
	error: StripePaymentError | null;
	createPaymentIntent: (data: CreatePaymentIntentRequest) => Promise<string | null>;
	confirmPayment: (
		clientSecret: string,
		cardElement: StripeElement,
		BillingDetails: BillingDetails
	) => Promise<PaymentIntent | null>;
	initializeStripe: () => Promise<void>;
}

export const useStripePayment = (): UseStripePaymentReturn => {
	const [stripe, setStripe] = useState<Stripe | null>(null);
	const [elements, setElements] = useState<StripeElements | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<StripePaymentError | null>(null);
	const [createPaymentIntentMutation] = useCreatePaymentIntentMutation();

	const initializeStripe = useCallback(async () => {
		if (stripe) return;

		try {
			const stripeInstance = await loadStripe(APP_CONFIG.stripePublishKey);
			if (stripeInstance) {
				setStripe(stripeInstance);
				setElements(stripeInstance.elements());
			}
		} catch (error) {
			setError({
				type: "initialization_error",
				message:
					extractErrorMessage(error as RequestFailure)?.data?.message ||
					"Failed to initialize Stripe",
			});
		}
	}, [stripe]);

	const createPaymentIntent = useCallback(
		async (data: CreatePaymentIntentRequest) => {
			try {
				setIsLoading(true);
				setError(null);
				const response = await createPaymentIntentMutation(data).unwrap();

				if (response.data.client_secret) {
					return response.data.client_secret;
				}

				return null;
			} catch (error) {
				setError({
					type: "create_payment_intent_error",
					message:
						extractErrorMessage(error as RequestFailure)?.data?.message ||
						"Failed to create payment intent",
				});
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[createPaymentIntentMutation]
	);

	const confirmPayment = useCallback(
		async (
			clientSecret: string,
			cardElement: StripeElement,
			billingDetails: BillingDetails
		): Promise<PaymentIntent | null> => {
			if (!stripe || !cardElement) return null;

			setIsLoading(true);
			setError(null);

			try {
				const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
					clientSecret,
					{
						payment_method: {
							card: cardElement as StripeCardElement,
							billing_details: (billingDetails as BillingDetails) || {},
						},
					}
				);

				if (confirmError) {
					setError({
						type: confirmError.type,
						code: confirmError.code,
						message: confirmError.message || "Payment confirmation failed",
						decline_code: confirmError.decline_code,
					});
					return null;
				}

				if (paymentIntent?.status === "succeeded") {
					return paymentIntent;
				}

				setError({
					type: "payment_error",
					message: `Payment status: ${paymentIntent?.status}`,
				});
				return null;
			} catch (error) {
				setError({
					type: "confirmation_error",
					message:
						extractErrorMessage(error as RequestFailure)?.data?.message ||
						"Payment confirmation failed",
				});
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[stripe]
	);

	return {
		stripe,
		elements,
		isLoading,
		createPaymentIntent,
		error,
		confirmPayment,
		initializeStripe,
	};
};
