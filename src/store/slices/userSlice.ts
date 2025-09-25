import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
  id: string | null;
  name: string | null;
  email: string | null;
  bio: string | null;
  role: string | null;
  experience: string | null;
  developerRole: string | null;
  techStacks: string[] | null;
  learningGoals: string[] | null;
  imageUrl: string | null;
  createdAt: Date | null;
  isOnboarding: boolean | null;
}

const initialState: IUserState = {
  id: null,
  name: null,
  email: null,
  role: null,
  bio: null,
  techStacks: null,
  learningGoals: null,
  experience: null,
  developerRole: null,
  imageUrl: null,
  createdAt: null,
  isOnboarding: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserState>) => {
      return action.payload;
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
    clearUser: () => initialState,
    setOnboardingStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnboarding = action.payload;
    },
  },
});

export const { setUser, setUserProfile, clearUser, setOnboardingStatus } =
  userSlice.actions;
export default userSlice.reducer;
