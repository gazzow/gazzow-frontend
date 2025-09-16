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
      state.user = {email: action.payload.email};
    },
    clearAuthEmail: (state) => {
      state.user = null
    }
  },
});

export const { setUserEmail, clearAuthEmail  } = authSlice.actions;
export default authSlice.reducer;
