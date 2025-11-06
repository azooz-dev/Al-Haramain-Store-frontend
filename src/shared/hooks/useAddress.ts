import { useCallback, useEffect } from "react";
import {
	useCreateAddressMutation,
	useUpdateAddressMutation,
	useDeleteAddressMutation,
	useGetUserAddressesQuery,
} from "../services/addressesApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import {
	setAddresses,
	addAddress,
	updateAddress as updateAddressAction,
	removeAddress,
} from "@/store/slices/userSlice";
import { AddressFormData, UpdateAddressRequest, DeleteAddressRequest } from "../types";

export const useAddress = () => {
	const { currentUser } = useAuth();
	const dispatch = useAppDispatch();
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
	} = useGetUserAddressesQuery(currentUser?.identifier as number, {
		skip: !currentUser?.identifier,
	});

	useEffect(() => {
		if (addresses) {
			dispatch(setAddresses(addresses.data.data));
		}
	}, [addresses, dispatch]);

	const createAddress = useCallback(
		async (addressData: AddressFormData) => {
			if (!currentUser?.identifier) {
				throw new Error("User not authenticated");
			}

			const response = await createAddressMutation({
				...addressData,
				userId: currentUser.identifier,
			}).unwrap();
			if (response.status === "success") {
				dispatch(addAddress(response.data));
			}
			return response.data;
		},
		[createAddressMutation, currentUser?.identifier, dispatch]
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
			if (response.status === "success") {
				dispatch(updateAddressAction(response.data));
			}
			return response.data;
		},
		[updateAddressMutation, currentUser?.identifier, dispatch]
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
			if (response.status === "success") {
				dispatch(removeAddress(addressData.addressId));
			}
			return response.message;
		},
		[deleteAddressMutation, currentUser?.identifier, dispatch]
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
