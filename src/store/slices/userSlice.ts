import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  profile: any | null;
  addresses: any[];
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  profile: null,
  addresses: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {}
});

export default userSlice.reducer;