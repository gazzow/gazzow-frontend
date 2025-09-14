import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAdminState {
  email: string;
  role: string;
}

const initialState: IAdminState = {
  email: "",
  role: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<IAdminState>) => {
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    setAdminEmail: (state, action: PayloadAction<IAdminState>) => {
      state.email = action.payload.email;
    },
    setAdminRole: (state, action: PayloadAction<IAdminState>) => {
      state.role = action.payload.role;
    },
    clearAdmin: (state) => {
      state.email = "";
      state.role = "";
    },
  },
});

export const { setAdmin, setAdminEmail, setAdminRole, clearAdmin } =
  adminSlice.actions;
export default adminSlice.reducer;
