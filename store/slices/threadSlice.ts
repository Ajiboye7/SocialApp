import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/*interface ThreadData {
  thread: string;
}*/

interface ThreadData {
  thread: string;
  parentId?: string; // Add parentId for comments
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
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isComment: boolean;
}

const initialState: ThreadState = {
  threads: [],
  status: "idle",
  error: null,
  isComment: false,
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

{/*export const getThreads = createAsyncThunk(
  "thread/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/threads");
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);*/}

//New Task

/*export const getThreadById = createAsyncThunk(
  "thread/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/threads/${id}`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch thread");
    }
  }
);*/
export const getThreads = createAsyncThunk(
  "thread/get",
  async (
    { topLevelOnly, userOnly }: { topLevelOnly?: boolean; userOnly?: boolean } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (topLevelOnly) params.append("topLevelOnly", "true");
      if (userOnly) params.append("userOnly", "true");
      const response = await axios.get(`/api/threads?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
     clearThreads: (state) => {
      state.threads = [];
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

      .addCase(deleteComment.pending, (state, action) => {
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
        (state.status = "succeeded"), (state.threads = action.payload.threads);
        state.error = null;
      })

      .addCase(getThreads.rejected, (state, action) => {
        (state.status = "failed"),
          (state.error = (action.payload as string) || "Failed to get threads");
      });
  },
});

export default threadSlice.reducer;
export const { clearThreads } = threadSlice.actions;
