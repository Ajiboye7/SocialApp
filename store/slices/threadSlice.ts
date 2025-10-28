import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ThreadData {
  thread: string;
  parentId?: string;
}

interface ThreadParams {
  topLevelOnly: boolean;
  userOnly?: boolean;
  authorId?: string;
  page: number;
  limit: number;
}

interface Thread {
  _id: string;
  author: AuthorInfo;
  thread: string;
  createdAt: string;
  parentId?: string;
  children: Comment[];
}
interface AuthorInfo {
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

interface ThreadState {
  threads: Thread[];
  thread: Thread | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isComment: boolean;
  totalPages: number;
  totalUserThread: number;
  //totalThreads: number
  currentPage: number;
  comments: Comment[];
  pagination: {
    totalComment: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

const initialState: ThreadState = {
  threads: [],
  thread: null,
  status: "idle",
  error: null,
  isComment: false,
  //totalThreads: 0,
  totalUserThread: 0,
  totalPages: 0,
  currentPage: 1,
  comments: [],
  pagination: {
    totalComment: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 5,
  },
};

export const createThread = createAsyncThunk(
  "thread/create",
  async (thread: ThreadData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/threads", thread);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const createComment = createAsyncThunk(
  "thread/createComment",
  async ({ thread, parentId }: ThreadData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/threads/${parentId}/comment`, {
        thread,
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      console.log(error);
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const deleteThread = createAsyncThunk(
  "thread/deleteThread",
  async (threadId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/threads/${threadId}`);
      return threadId;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const deleteComment = createAsyncThunk(
  "thread/deleteComment",
  async (
    { parentId, commentId }: { parentId: string; commentId: string },
    { rejectWithValue }
  ) => {
    try {
      await axios.delete(`/api/threads/${parentId}/comment/${commentId}`);
      return { parentId, commentId };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getThreadById = createAsyncThunk(
  "thread/getThreadById",
  async (
    {
      threadId,
      page = 1,
      limit = 5,
    }: { threadId: string; page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      const response = await axios.get(
        `/api/threads/${threadId}?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

{
  /*export const getThreads = createAsyncThunk(
  "thread/get",
  async (
    {
      topLevelOnly,
      userOnly,
      page = 1,
      limit = 10,
    }: {
      topLevelOnly?: boolean;
      userOnly?: boolean;
      page?: number;
      limit?: number;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (topLevelOnly) params.append("topLevelOnly", "true");
      if (userOnly) params.append("userOnly", "true");
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      const response = await axios.get(`/api/threads?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);*/
}

export const getThreads = createAsyncThunk(
  "threads/get",
  async (params: ThreadParams, { rejectWithValue }) => {
    try {
      let url = `/api/threads?topLevelOnly=${params.topLevelOnly}&page=${params.page}&limit=${params.limit}`;

      if (params.userOnly) url += `&userOnly=true`;
      if (params.authorId) url += `&authorId=${params.authorId}`;

      const response = await axios.get(url);
      return response.data.data

    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("Failed to fetch threads");
    }
  }
);
const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    clearThreads: (state) => {
      state.threads = [];
      state.currentPage = 1;
      state.totalPages = 0;
      state.totalUserThread = 0;
      state.error = null; 
    },

    
  },

  extraReducers: (builder) => {
    builder
      .addCase(createThread.pending, (state) => {
        state.status = "loading";
      })

      .addCase(createThread.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.threads.push(action.payload);
        state.error = null;
      })

      .addCase(createThread.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to create thread";
      })

      .addCase(deleteThread.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteThread.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.threads = state.threads.filter((t) => t._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteThread.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to delete thread";
      })

      .addCase(createComment.pending, (state) => {
        state.status = "loading";
      })

      .addCase(createComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        const parentThread = state.threads.find(
          (t) => t._id === action.payload.parentId
        );
        if (parentThread) {
          parentThread.children = parentThread.children || [];
          parentThread.children.push(action.payload);
        } else {
          state.threads.push(action.payload);
        }
        state.error = null;
        state.isComment = true;
        //console.log('Thread payload',action.payload )
      })

      .addCase(createComment.rejected, (state, action) => {
        (state.status = "failed"),
          (state.error =
            (action.payload as string) || "Failed to create comment");
      })

      .addCase(deleteComment.pending, (state) => {
        state.status === "loading";
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = "succeeded";

        const parentThread = state.threads.find(
          (t) => t._id === action.payload.parentId
        );

        if (parentThread) {
          parentThread.children =
            parentThread.children?.filter(
              (c) => c._id !== action.payload.commentId
            ) || [];
        }
        state.error = null;
      })

      .addCase(deleteComment.rejected, (state, action) => {
        state.status === "failed";
        state.error = (action.payload as string) || "Failed to delete comment";
      })

      .addCase(getThreads.pending, (state) => {
        state.status = "loading";
      })

      .addCase(getThreads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.threads = action.payload.threads;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalUserThread = action.payload.totalUserThread;
        //state.totalThreads = action.payload.totalThreads
        state.error = null;
      })

      .addCase(getThreads.rejected, (state, action) => {
        (state.status = "failed"),
          (state.error = (action.payload as string) || "Failed to get threads");
      })
      .addCase(getThreadById.pending, (state) => {
        state.status = "loading";
      })

      .addCase(getThreadById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.thread = action.payload.thread;
        state.comments = action.payload.children;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getThreadById.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to get a thread";
      });
  },
});

export default threadSlice.reducer;
export const { clearThreads } = threadSlice.actions;
