import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ThreadData {
  thread: string;
}

interface Thread {
  _id: string;
  author: string;
  thread: string;
  createdAt: string;
}

interface ThreadState {
  threads: Thread[];  // store multiple
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ThreadState = {
  threads: [],
  status: "idle",
  error: null,
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

      .addCase(getThreads.pending, (state, action)=>{
        state.status = 'loading'
      })

      .addCase(getThreads.fulfilled, (state, action)=>{
        state.status = 'succeeded',
        state.threads = action.payload.threads
        state.error = null;
      })
      
      .addCase(getThreads.rejected, (state, action)=>{
        state.status = 'failed',
        state.error = (action.payload as string ) || 'Failed to get threads'
      })
     
  },
});

export default threadSlice.reducer;
