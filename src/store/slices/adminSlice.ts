import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

interface IAdminState {
  id: string | null;
  email: string | null;
  role: UserRole | null;
}

const initialState: IAdminState = {
  id: null,
  email: null,
  role: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<IAdminState>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearAdmin: (state) => {
      state.id = null;
      state.email = null;
      state.role = null;
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
