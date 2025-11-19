import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CommunityDataTypes {
  id: string;
  name: string;
  slug: string;
  bio: string;
  community_picture: string;
}

interface Community {
  id: string;
  name: string;
  slug: string;
  bio: string;
  community_picture: string;
  createdBy: string;
}
interface CommunityState {
  communities: Community[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CommunityState = {
  communities: [],
  status: "idle",
  error: null,
};

export const createCommunity = createAsyncThunk(
  "community/create",
  async (communityData: CommunityDataTypes, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/communities", communityData);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getCommunities = createAsyncThunk(
  "community/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/communities");
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createCommunity.pending, (state) => {
        state.status = "loading";
      })

      .addCase(createCommunity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.communities.push(action.payload);
        state.error = null;
      })

      .addCase(createCommunity.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to create community";
      })

      .addCase(getCommunities.pending, (state) => {
        state.status = "loading";
      })

      .addCase(getCommunities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.communities = action.payload;
        state.error = null;
      })

      .addCase(getCommunities.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to create community";
      });
  },
});

export default communitySlice.reducer;
