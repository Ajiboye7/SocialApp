import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserData {
  name: string;
  userName: string;
  bio: string;
  profile_picture: string;
}

interface User {
  id:string;
  name: string;
  userName: string;
  bio: string;
  profile_picture: string;
  onboarded: boolean;
  //isOnboarded: boolean;
}

interface UserState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  //isOnboarded: boolean;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
  //isOnboarded: false,
};
export const fetchUser = createAsyncThunk(
  "user/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/users/");
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error);
      }
      return rejectWithValue("Failed to fetch user data");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (userData: UserData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/users/", userData);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;

        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch user";
      });

    builder.addCase(updateUser.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      (state.status = "succeeded"), (state.user = action.payload);
      //state.isOnboarded = action.payload.onboarded
      state.error = null;
    });

    builder.addCase(updateUser.rejected, (state, action) => {
      state.status = "failed";
      state.user = null;
      state.error = (action.payload as string) || "Failed to update user";
    });
  },
});

export default userSlice.reducer;
