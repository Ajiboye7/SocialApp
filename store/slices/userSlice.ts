import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { stat } from "fs";


interface UserData {
  name: string;
  userName: string;
  bio: string;
  profile_picture: string;
}

interface User {
  id: string;
  name: string;
  userName: string;
  bio: string;
  profile_picture: string;
  onboarded: boolean;
}

interface UserState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};
export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/users/");
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("Failed to fetch user data");
    }
  }
);

export const fetchUser = createAsyncThunk(
  "user/fetch",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/users/${username}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
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
        return rejectWithValue(error.response?.data.message || error.message);
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
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;

        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch users";
      })

      .addCase(fetchUser.pending, (state)=>{
        state.status = 'loading'
      })

      .addCase(fetchUser.fulfilled, (state, action)=>{
        state.status = 'succeeded',
        state.user = action.payload.user
        state.error = null
      })

      .addCase(fetchUser.rejected, (state, action)=>{
        state.status = 'failed',
        state.user = null,
        state.error = (action.payload as string) || "Failed to get user";
      })

      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        (state.status = "succeeded"), (state.user = action.payload);
        state.error = null;
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = (action.payload as string) || "Failed to update user";
      });
  },
});

export default userSlice.reducer;
