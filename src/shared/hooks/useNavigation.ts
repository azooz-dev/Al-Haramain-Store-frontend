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
	};
};
