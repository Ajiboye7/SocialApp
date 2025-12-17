import Community from "@/lib/models/community.model";
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
  members: [];
  requests: [];
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
  members: AuthorInfo[];
  threads: Thread[];
  requests: AuthorInfo[];
  community_picture: string;
  createdBy: AuthorInfo;
}
interface CommunityState {
  community: Community | null;
  communities: Community[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  totalThreads: number;
  totalRequests: number;
  totalMembers: number;
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
  totalThreads: 0,
  totalRequests: 0,
  totalMembers: 0,
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

export const getCommunities = createAsyncThunk(
  "community/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/communities");
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

export const getCommunityById = createAsyncThunk(
  "community/getCommunityById",
  async (communityId: string, { rejectWithValue }) => {
    try {
      /*const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());*/

      /*const response = await axios.get(
        `/api/communities/${communityId}?${params.toString()}`
      );*/
      const response = await axios.get(`/api/communities/${communityId}`);
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

export const sendJoinRequest = createAsyncThunk(
  "community/joinRequest",
  async (
    { communityId, request }: { communityId: string; request: "do" | "undo" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `/api/communities/${communityId}?request=${request}`
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
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const joinRequestDecision = createAsyncThunk(
  "community/handleJoinRequestDecision",
  async (
    {
      id,
      userId,
      action,
    }: { id: string; userId: string; action: "accept" | "reject" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(
        `/api/communities/${id}/request/${userId}?action=${action}`
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
      return rejectWithValue("Unexpected error occurred.");
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
        state.communities.push(action.payload.data);
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
        state.communities = action.payload.data;
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
          (state.community = action.payload.data.community);
        state.totalMembers = action.payload.data.totalMembers || 0;
        state.totalRequests = action.payload.data.totalRequests || 0;
        state.totalThreads = action.payload.data.totalThreads || 0;
        state.pagination = action.payload.data.pagination;
        state.error = null;
      })

      .addCase(getCommunityById.rejected, (state, action) => {
        (state.status = "failed"),
          (state.error =
            (action.payload as string) || "Failed to get a community");
      })

      .addCase(sendJoinRequest.pending, (state) => {
        state.status = "loading";
      })

      .addCase(sendJoinRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.community) {
          state.community.requests = action.payload.data.requests;
          state.totalMembers = action.payload.data.totalMembers;
          state.totalRequests = action.payload.data.totalRequests;
          state.totalThreads = action.payload.data.totalThreads;
        }

        console.log(
          "community count",
          state.totalMembers,
          state.totalRequests,
          state.totalThreads
        );
      })

      .addCase(sendJoinRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "failed to send join request";
      })

      .addCase(joinRequestDecision.pending, (state) => {
        state.status = "loading";
      })

      .addCase(joinRequestDecision.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.community) {
          state.community.requests = action.payload.data.requests;
          state.community.members = action.payload.data.members;
          state.totalMembers = action.payload.data.totalMembers || 0;
          state.totalRequests = action.payload.data.totalRequests || 0;
          state.totalThreads = action.payload.data.totalThreads || 0;
        }
      })
      .addCase(joinRequestDecision.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to select decision";
      });
  },
});

export default communitySlice.reducer;
