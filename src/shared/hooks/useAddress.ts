import { useCallback } from "react";
import {
	useCreateAddressMutation,
	useUpdateAddressMutation,
	useDeleteAddressMutation,
	useGetUserAddressesQuery,
} from "../services/addressesApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AddressFormData, UpdateAddressRequest, DeleteAddressRequest } from "../types";

export const useAddress = () => {
	const { currentUser } = useAuth();
	const [createAddressMutation, { isLoading: isCreatingAddress, error: createAddressError }] =
		useCreateAddressMutation();
	const [updateAddressMutation, { isLoading: isUpdatingAddress, error: updateAddressError }] =
		useUpdateAddressMutation();
	const [deleteAddressMutation, { isLoading: isDeletingAddress, error: deleteAddressError }] =
		useDeleteAddressMutation();
	const {
		data: addresses,
		isLoading: isLoadingAddresses,
		error: addressesError,
	} = useGetUserAddressesQuery(currentUser?.identifier as number);

	const createAddress = useCallback(
		async (addressData: AddressFormData) => {
			if (!currentUser?.identifier) {
				throw new Error("User not authenticated");
			}

			const response = await createAddressMutation({
				...addressData,
				userId: currentUser.identifier,
			}).unwrap();
			return response.data;
		},
		[createAddressMutation, currentUser?.identifier]
	);

	const updateAddress = useCallback(
		async (addressData: UpdateAddressRequest) => {
			if (!currentUser?.identifier) {
				throw new Error("User not authenticated");
			}

			const response = await updateAddressMutation({
				...addressData,
				userId: currentUser.identifier,
			}).unwrap();
			return response.data;
		},
		[updateAddressMutation, currentUser?.identifier]
	);

	const deleteAddress = useCallback(
		async (addressData: DeleteAddressRequest) => {
			if (!currentUser?.identifier) {
				throw new Error("User not authenticated");
			}

			const response = await deleteAddressMutation({
				...addressData,
				userId: currentUser.identifier,
			}).unwrap();
			return response.message;
		},
		[deleteAddressMutation, currentUser?.identifier]
	);

	return {
		addresses,
		addressesError,
		isLoadingAddresses,
		createAddress,
		updateAddress,
		deleteAddress,
		isCreatingAddress,
		createAddressError,
		isUpdatingAddress,
		updateAddressError,
		isDeletingAddress,
		deleteAddressError,
	};
};
