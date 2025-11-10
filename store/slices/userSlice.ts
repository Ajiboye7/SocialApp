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
  _id: string;
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
  sidebarUsers: User[];
  totalPages: number;
  currentPage: number;
  sidebarTotalPages: number;
  sidebarCurrentPage: number;
  status: "idle" | "loading" | "succeeded" | "failed";
   usersStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  currentUser: null,
  users: [],
  sidebarUsers: [],
  totalPages: 0,
  currentPage: 1,
  sidebarTotalPages: 0,
  sidebarCurrentPage: 1,
  status: "idle",
  usersStatus: 'idle',
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

export const fetchSidebarUsers = createAsyncThunk(
  "users/fetchSidebar",
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
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
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
        //console.log('current user redux ',action.payload.currentUser );
      })

      .addCase(currentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch current user";
      })
      .addCase(fetchUsers.pending, (state) => {
        state.usersStatus = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersStatus = "succeeded";
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersStatus = "failed";
        state.error = (action.payload as string) || "Failed to fetch users";
      })

      .addCase(fetchSidebarUsers.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchSidebarUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sidebarUsers = action.payload.users;
        state.sidebarCurrentPage = action.payload.currentPage;
        state.sidebarTotalPages = action.payload.totalPages;
        state.error = null;
      })

      .addCase(fetchSidebarUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch sidebar users";
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
export const { clearCurrentUser, clearUser } = userSlice.actions;
