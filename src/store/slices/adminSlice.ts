import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAdminState {
  role: string;
}

const initialState: IUserState = {
  id: "",
  name: "",
  email: "",
  role: "",
  bio: "",
  techStacks: [],
  learningGoals: [],
  experience: "",
  developerRole: "",
  imageUrl: "",
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
    setUserProfile: (state, action: PayloadAction<IUserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.createdAt = action.payload.createdAt;
      state.bio = action.payload.bio;
      state.developerRole = action.payload.developerRole;
      state.imageUrl = action.payload.imageUrl;
      state.experience = action.payload.experience;
      state.techStacks = action.payload.techStacks;
      state.learningGoals = action.payload.learningGoals;
    },
    clearUser: (state) => {
      state.id = "";
      state.name = "";
      state.email = "";
      state.role = "";
      state.bio = "";
      state.techStacks = [];
      state.learningGoals = [];
      state.experience = "";
      state.developerRole = "";
      state.imageUrl = "";
      state.createdAt = new Date();
    },
  },
});

export const { setUser, setUserProfile, clearUser } = userSlice.actions;
export default userSlice.reducer;
