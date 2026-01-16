import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserData {
  name: string;
  userName: string;
  bio: string;
  profile_picture: string;
}

interface AuthorInfo {
  _id: string;
   id: string;
  username: string;
  profile_picture: string;
}

interface Comment {
  _id: string;
  author: AuthorInfo;
  thread: string;
  createdAt: string;
  parentId: string;
  children: Comment[];
}
interface CommunityInfo {
  _id: string;
  name: string;
  bio: string;
  slug: string;
  community_picture: string;
  createdAt: string;
}

interface Thread {
  _id: string;
  author: AuthorInfo;
  thread: string;
  createdAt: string;
  parentId?: string;
  children: Comment[];
  community?: CommunityInfo;
}

interface User {
  id: string;
  _id: string;
  name: string;
  username: string;
  threads: Thread[];
  bio: string;
  profile_picture: string;
  onboarded: boolean;
}

interface UserState {
  users: {
    items: User[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    pagination: {
      currentPage: number;
      limit: number;
      totalPages: number;
    };
  };

  sidebar: {
    items: User[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
  user: {
    item: User | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };

  currentUser: {
    item: User | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
}

const initialState: UserState = {
  users: {
    items: [],
    status: "idle",
    error: null,
    pagination: {
      currentPage: 1,
      limit: 4,
      totalPages: 0,
    },
  },

  sidebar: {
    items: [],
    status: "idle",
    error: null,
  },

  user: {
    item: null,
    status: "idle",
    error: null,
  },

  currentUser: {
    item: null,
    status: "idle",
    error: null,
  },
};

export const currentUser = createAsyncThunk(
  "currentUser/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/users/me");
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
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
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
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
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
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
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
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
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
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
      state.currentUser.item = null;
      state.currentUser.status = "idle";
      state.currentUser.error = null;
    },

    clearUser: (state) => {
      state.users.items = [];
      state.users.status = "idle";
      state.users.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(currentUser.pending, (state) => {
        state.currentUser.status = "loading";
      })

      .addCase(currentUser.fulfilled, (state, action) => {
        state.currentUser.status = "succeeded";
        state.currentUser.item = action.payload.data.currentUser;
        state.currentUser.error = null;
        
      })

      .addCase(currentUser.rejected, (state, action) => {
        state.currentUser.status = "failed";
        state.currentUser.error =
          (action.payload as string) || "Failed to fetch current user";
      })
      .addCase(fetchUsers.pending, (state) => {
        state.users.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.status = "succeeded";
        state.users.items = action.payload.data.users;
        state.users.pagination.totalPages = action.payload.data.totalPages;
        state.users.pagination.currentPage = action.payload.data.currentPage;
        state.users.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.status = "failed";
        state.users.error =
          (action.payload as string) || "Failed to fetch users";
      })

      .addCase(fetchSidebarUsers.pending, (state) => {
        state.sidebar.status = "loading";
      })

      .addCase(fetchSidebarUsers.fulfilled, (state, action) => {
        state.sidebar.status = "succeeded";
        state.sidebar.items = action.payload.data.users;
        state.sidebar.error = null;
      })

      .addCase(fetchSidebarUsers.rejected, (state, action) => {
        state.sidebar.status = "failed";
        state.sidebar.error =
          (action.payload as string) || "Failed to fetch sidebar users";
      })

      .addCase(fetchUser.pending, (state) => {
        state.user.status = "loading";
      })

      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user.status = "succeeded";
        state.user.item = action.payload.data.user;
        state.user.error = null;
      })

      .addCase(fetchUser.rejected, (state, action) => {
        state.user.status = "failed";
        state.user.item = null;
        state.user.error = (action.payload as string) || "Failed to get user";
      })

      .addCase(updateUser.pending, (state) => {
        state.user.status = "loading";
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user.status = "succeeded";
        state.user.item = action.payload.data;
        state.user.error = null;
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.user.status = "failed";
        state.user.item = null;
        state.user.error =
          (action.payload as string) || "Failed to update user";
      });
  },
});

export default userSlice.reducer;
export const { clearCurrentUser, clearUser } = userSlice.actions;
