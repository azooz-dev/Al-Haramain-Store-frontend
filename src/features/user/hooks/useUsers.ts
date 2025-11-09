import {
	useGetUserQuery,
	useUpdateUserMutation,
	useDeleteUserMutation,
	useGetUserOrdersQuery,
	useCreateReviewMutation,
} from "../services/usersApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UpdateUserRequest, DeleteUserRequest, CreateReviewRequest } from "../types";
import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setProfile, setOrders, updateProfile, deleteUserAction } from "@/store/slices/userSlice";
import { extractErrorMessage } from "@/shared/utils/extractErrorMessage";
import type { RequestFailure } from "@/shared/types";
import type { User } from "@/features/auth/types";

export const useUsers = () => {
	const { currentUser } = useAuth();
	const dispatch = useAppDispatch();
	const { data: userData, isLoading: isLoadingUser, error: userError } = useGetUserQuery();
	const [updateUserMutation, { isLoading: isUpdatingUser, error: updateUserError }] =
		useUpdateUserMutation();
	const [deleteUserMutation, { isLoading: isDeletingUser, error: deleteUserError }] =
		useDeleteUserMutation();
	const [createReviewMutation, { isLoading: isCreatingReview, error: createReviewError }] =
		useCreateReviewMutation();
	const {
		data: userOrdersData,
		isLoading: isLoadingUserOrders,
		error: userOrdersError,
	} = useGetUserOrdersQuery(
		{ userId: currentUser?.identifier as number },
		{
			skip: !currentUser?.identifier,
		}
	);

	useEffect(() => {
		if (userData) {
			dispatch(setProfile(userData.data));
		}

		if (userOrdersData) {
			dispatch(setOrders(userOrdersData.data.data));
		}
	}, [userData, userOrdersData, dispatch]);

	const updateUser = useCallback(
		async (payload: UpdateUserRequest): Promise<User | string> => {
			try {
				const response = await updateUserMutation(payload).unwrap();
				if (response.status === "success") {
					dispatch(updateProfile(response.data));
					return response.data;
				}
				return response.message || "Update failed. Please try again.";
			} catch (error) {
				const errorMessage = extractErrorMessage(error as RequestFailure);
				return errorMessage.data.message;
			}
		},
		[updateUserMutation, dispatch]
	);

	const deleteUser = useCallback(
		async (payload: DeleteUserRequest) => {
			const response = await deleteUserMutation(payload).unwrap();
			if (response.status === "success") {
				dispatch(deleteUserAction());
				return true;
			}
			return false;
		},
		[deleteUserMutation, dispatch]
	);

	const createReview = useCallback(
		async ({ userId, orderId, itemId, rating, comment, locale }: CreateReviewRequest) => {
			const response = await createReviewMutation({
				userId: userId,
				orderId: orderId,
				itemId: itemId,
				rating: rating,
				comment: comment,
				locale: locale,
			}).unwrap();
			if (response.status === "success") {
				return response.data;
			}
			return response.message;
		},
		[createReviewMutation]
	);

	return {
		userData,
		isLoadingUser,
		userError,
		updateUser,
		isUpdatingUser,
		updateUserError,
		deleteUser,
		isDeletingUser,
		deleteUserError,
		userOrdersData,
		isLoadingUserOrders,
		userOrdersError,
		createReview,
		isCreatingReview,
		createReviewError,
	};
};
