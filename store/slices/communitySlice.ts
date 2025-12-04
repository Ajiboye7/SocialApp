import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CommunityDataTypes {
  id: string;
  name: string;
  slug: string;
  bio: string;
  community_picture: string;
  createdAt: string;
}
interface CommunityInfo {
  _id: string;
  name: string;
  bio: string;
  slug: string;
  community_picture: string;
  createdAt: string;
}
interface Comment {
  _id: string;
  author: AuthorInfo;
  thread: string;
  createdAt: string;
  parentId: string;
  children: Comment[];
}

interface Thread {
  _id: string;
  author: AuthorInfo;
  thread: string;
  createdAt: string;
  parentId?: string;
  children: Comment[];
  community: CommunityInfo;
}
interface AuthorInfo {
  _id: string;
  username: string;
  profile_picture: string;
}


interface Community {
  id: string;
  _id: string;
  name: string;
  slug: string;
  bio: string;
  members: AuthorInfo[]
  threads: Thread[]
  community_picture: string;
  createdBy: string;
}
interface CommunityState {
  community : Community | null
  communities: Community[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    currentPage: number;
    limit: number;
  };
}

const initialState: CommunityState = {
  community: null,
  communities: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    limit: 5,
  },
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

export const getCommunityById = createAsyncThunk(
  "community/getCommunityById",
  async (
    communityId : string,
    { rejectWithValue }
  ) => {
    try {
      /*const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());*/

      /*const response = await axios.get(
        `/api/communities/${communityId}?${params.toString()}`
      );*/
      const response = await axios.get(`/api/communities/${communityId}`)
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
      })

      .addCase(getCommunityById.pending, (state) => {
        state.status = "loading";
      })

      .addCase(getCommunityById.fulfilled, (state, action) => {
        (state.status = "succeeded"),
          (state.community = action.payload.community);
        state.pagination = action.payload.pagination;
        state.error = null;
      })

      .addCase(getCommunityById.rejected, (state, action) => {
        (state.status = "failed"),
          (state.error =
            (action.payload as string) || "Failed to get a community");
      });
  },
});

export default communitySlice.reducer;
