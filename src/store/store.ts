// src/store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import authReducer from "./slices/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  admin: adminReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user", "admin"], // only given slices will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

export const persistor = persistStore(store);

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
