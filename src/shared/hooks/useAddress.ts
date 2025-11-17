import { useCallback, useEffect } from "react";
import {
	useCreateAddressMutation,
	useUpdateAddressMutation,
	useDeleteAddressMutation,
	useGetUserAddressesQuery,
} from "../services/addressesApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	setAddresses,
	addAddress,
	updateAddress as updateAddressAction,
	removeAddress,
	selectAddresses,
} from "@/store/slices/userSlice";
import {
	AddressFormData,
	UpdateAddressRequest,
	DeleteAddressRequest,
	AddressResponse,
	DeleteAddressResponse,
} from "../types";

export const useAddress = () => {
	const { currentUser } = useAuth();
	const addresses = useAppSelector(selectAddresses);
	const dispatch = useAppDispatch();
	const [createAddressMutation, { isLoading: isCreatingAddress, error: createAddressError }] =
		useCreateAddressMutation();
	const [updateAddressMutation, { isLoading: isUpdatingAddress, error: updateAddressError }] =
		useUpdateAddressMutation();
	const [deleteAddressMutation, { isLoading: isDeletingAddress, error: deleteAddressError }] =
		useDeleteAddressMutation();
	const {
		data: addressesData,
		isLoading: isLoadingAddresses,
		error: addressesError,
	} = useGetUserAddressesQuery(currentUser?.identifier as number, {
		skip: !currentUser?.identifier,
	});

	useEffect(() => {
		if (addressesData) {
			dispatch(setAddresses(addressesData.data.data));
		}
	}, [addressesData, dispatch]);

	const createAddress = useCallback(
		async (addressData: AddressFormData): Promise<AddressResponse> => {
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
			return response;
		},
		[createAddressMutation, currentUser?.identifier, dispatch]
	);

	const updateAddress = useCallback(
		async (addressData: UpdateAddressRequest): Promise<AddressResponse> => {
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
			return response;
		},
		[updateAddressMutation, currentUser?.identifier, dispatch]
	);

	const deleteAddress = useCallback(
		async (addressData: DeleteAddressRequest): Promise<DeleteAddressResponse> => {
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
			return response;
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
