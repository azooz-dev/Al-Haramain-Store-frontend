import { useNavigate } from "react-router";

export const useNavigation = () => {
	const navigate = useNavigate();

	const navigateTo = (
		path: string,
		options?: { replace?: boolean; state?: Record<string, string> }
	) => {
		navigate(path, options);
	};

	const navigateToSignIn = () => {
		navigate("/signin", { replace: true });
	};

	const navigateToSignUp = () => {
		navigate("/signup", { replace: true });
	};

	const navigateToVerifyOTP = (email: string) => {
		navigate("/verify-otp", { replace: true, state: { email: email } });
	};

	const navigateToForgetPassword = () => {
		navigate("/forget-password", { replace: true });
	};

	const navigateToResetPassword = (token?: string, email?: string) => {
		const params = new URLSearchParams();
		if (token) params.set("token", token);
		if (email) params.set("email", email);
		const queryString = params.toString();
		const path = queryString ? `/reset-password?${queryString}` : "/reset-password";
		navigate(path, { replace: true });
	};

	const navigateToHome = () => {
		navigate("/", { replace: true });
	};

	const navigateToProductDetail = (slug: string, id: number) => {
		navigate(`/products/${slug}/${id}`, { replace: true });
	};

	const navigateToProducts = () => {
		navigate("/products", { replace: true });
	};

	const navigateToFavorites = () => {
		navigate("/favorites", { replace: true });
	};

	const navigateToOffers = () => {
		navigate("/offers", { replace: true });
	};

	const navigateToOffersDetails = (offerId: number) => {
		navigate(`/offers/${offerId}`, { replace: true });
	};

	const navigateToCategoriesDetails = (id: number, slug: string) => {
		navigate(`/categories/${slug}/${id}`, { replace: true });
	};

	const navigateToAboutPage = () => {
		navigate("/about", { replace: true });
	};

	const navigateToContactPage = () => {
		navigate("/contact", { replace: true });
	};

	return {
		navigateTo,
		navigateToSignIn,
		navigateToSignUp,
		navigateToVerifyOTP,
		navigateToForgetPassword,
		navigateToResetPassword,
		navigateToHome,
		navigateToProductDetail,
		navigateToProducts,
		navigateToFavorites,
		navigateToOffers,
		navigateToOffersDetails,
		navigateToCategoriesDetails,
		navigateToAboutPage,
		navigateToContactPage,
	};
};
