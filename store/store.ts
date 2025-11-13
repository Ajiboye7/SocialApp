import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/slices/userSlice";
import threadReducer from "../store/slices/threadSlice";
import communityReducer from "../store/slices/communitySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    thread: threadReducer,
    community: communityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
