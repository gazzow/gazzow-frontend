import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

const initialState: IUserState = {
  id: "",
  name: "",
  email: "",
  createdAt: new Date(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.createdAt = action.payload.createdAt;
    },
    clearUser: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.createdAt = new Date();
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
