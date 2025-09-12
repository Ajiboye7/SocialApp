import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { threadId } from "worker_threads";

/*interface ThreadData {
  thread: string;
}*/

interface ThreadData {
  thread: string;
  parentId?: string; // Add parentId for comments
}

/*interface Thread {
  _id: string;
  author: string;
  thread: string;
  createdAt: string;
  parentId?: string;
  children: Thread[]; // Add children to store comments
}*/
interface Thread {
  _id: string;
  author: string; // Just user ID
  thread: string;
  createdAt: string;
  parentId?: string;
  children: Comment[]; // Use Comment interface here
}
interface AuthorInfo {
  username: string;
  profile_picture: string;
}

interface Comment {
  _id: string;
  author: AuthorInfo;
  thread: string;
  createdAt: string;
  parentId: string; // Points to thread or another comment
  children: Comment[]; // Nested replies
}

interface ThreadState {
  threads: Thread[]; // store multiple
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isComment: boolean
}

const initialState: ThreadState = {
  threads: [],
  status: "idle",
  error: null,
  isComment: false
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

export const deleteThread = createAsyncThunk('thread/deleteThread', async(threadId: string, {rejectWithValue})=>{
  try{
     await axios.delete(`/api/threads/${threadId}/comment`);
    return threadId

  }catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }

})
export const getThreads = createAsyncThunk(
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
);

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {},
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

      .addCase(createComment.pending, (state)=>{
        state.status = 'loading'
      })

      .addCase(createComment.fulfilled,(state, action)=>{
        state.status = 'succeeded'
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
        state.isComment= true
      })

      .addCase(createComment.rejected, (state, action)=>{
        state.status = 'failed',
        state.error = (action.payload as string) || "Failed to create comment";
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
