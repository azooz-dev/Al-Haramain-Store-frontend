import {
	useGetUserQuery,
	useUpdateUserMutation,
	useDeleteUserMutation,
	useGetUserOrdersQuery,
} from "../services/usersApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UpdateUserRequest, DeleteUserRequest } from "../types";
import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setProfile, setOrders, updateProfile, deleteUserAction } from "@/store/slices/userSlice";

export const useUsers = () => {
	const { currentUser } = useAuth();
	const dispatch = useAppDispatch();
	const { data: userData, isLoading: isLoadingUser, error: userError } = useGetUserQuery();
	const [updateUserMutation, { isLoading: isUpdatingUser, error: updateUserError }] =
		useUpdateUserMutation();
	const [deleteUserMutation, { isLoading: isDeletingUser, error: deleteUserError }] =
		useDeleteUserMutation();
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
		async (payload: UpdateUserRequest) => {
			const response = await updateUserMutation(payload).unwrap();
			if (response.status === "success") {
				dispatch(updateProfile(response.data));
				return response.data;
			}
			return response.message;
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
	};
};
