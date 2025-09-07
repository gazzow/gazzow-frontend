import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAuthState {
  user: { email: string } | null;
}

const initialState: IAuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<{ email: string }>) => {
      state.user = action.payload;
    },
  },
});

export const { setUserEmail } = authSlice.actions;
export default authSlice.reducer;
