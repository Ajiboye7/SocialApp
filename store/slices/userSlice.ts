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
  username: string;
  bio: string;
  profile_picture: string;
  onboarded: boolean;
}

interface UserState {
  user: User | null;
  currentUser: User | null;
  users: User[];
  totalPages: number;
  currentPage: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  currentUser: null,
  users: [],
  totalPages: 0,
  currentPage: 1,
  status: "idle",
  error: null,
};

export const currentUser = createAsyncThunk(
  "currentUser/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/users/me");
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("Failed to fetch current user data");
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/users?page=${page}&limit=${limit}`
      );
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
  reducers: {
    clearCurrentUser : (state)=>{
      state.currentUser = null
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(currentUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(currentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload.currentUser;
        state.error = null;
      })

      .addCase(currentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch current user";
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch users";
      })

      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.error = null;
        //console.log("Redux - User data received:", action.payload.user);
        /* console.log(
          "Redux - Profile picture:",
          action.payload.user
        );*/
      })

      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
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
export const {clearCurrentUser} = userSlice.actions
