import { toast } from "react-hot-toast";
import { useApp } from "@shared/contexts/AppContext";

export const useToast = () => {
	const { isRTL } = useApp();

	const showSuccess = (message: string, options?: Parameters<typeof toast.success>[1]) => {
		return toast.success(message, {
			duration: 3000,
			style: {
				borderLeft: isRTL ? "none" : "4px solid #10b981",
				borderRight: isRTL ? "4px solid #10b981" : "none",
			},
			...options,
		});
	};

	const showError = (message: string, options?: Parameters<typeof toast.error>[1]) => {
		return toast.error(message, {
			duration: 5000,
			style: {
				borderLeft: isRTL ? "none" : "4px solid #ef4444",
				borderRight: isRTL ? "4px solid #ef4444" : "none",
			},
			...options,
		});
	};

	const showInfo = (message: string, options?: Parameters<typeof toast>[1]) => {
		return toast(message, {
			icon: "ℹ️",
			duration: 4000,
			style: {
				borderLeft: isRTL ? "none" : "4px solid #3b82f6",
				borderRight: isRTL ? "4px solid #3b82f6" : "none",
			},
			...options,
		});
	};

	const showWarning = (message: string, options?: Parameters<typeof toast>[1]) => {
		return toast(message, {
			icon: "⚠️",
			duration: 4000,
			style: {
				borderLeft: isRTL ? "none" : "4px solid #f59e0b",
				borderRight: isRTL ? "4px solid #f59e0b" : "none",
			},
			...options,
		});
	};

	const showLoading = (message: string) => {
		return toast.loading(message);
	};

	const showPromise = <T>(
		promise: Promise<T>,
		messages: {
			loading: string;
			success: string | ((data: T) => string);
			error: string | ((error: unknown) => string);
		}
	) => {
		return toast.promise(promise, messages);
	};

	const dismiss = (toastId?: string) => {
		toast.dismiss(toastId);
	};

	return {
		success: showSuccess,
		error: showError,
		info: showInfo,
		warning: showWarning,
		loading: showLoading,
		promise: showPromise,
		dismiss,
		toast,
	};
};
