import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


interface ThreadData {
  thread: string;
}

interface Thread {
  id: string;
  author: string;
  thread: string;
}

interface ThreadState {
  thread: Thread | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ThreadState = {
  thread: null,
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
        return rejectWithValue(error.response?.data.message || error);
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
        state.thread = action.payload;
        state.error = null;
      })

      .addCase(createThread.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to create thread";
      });
  },
});

export default threadSlice.reducer;
