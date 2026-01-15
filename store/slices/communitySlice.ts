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
  communities: {
    items: Community[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    pagination: {
      currentPage: number;
      limit: number;
      totalPages?: number;
    };
    totals: {
      totalThreads: number;
      totalRequests: number;
      totalMembers: number;
    };
  };

  sidebar: {
    items: Community[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };

  community: {
    item: Community | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    totals: {
      totalThreads: number;
      totalRequests: number;
      totalMembers: number;
    };
  };
}


const initialState: CommunityState = {
  communities: {
    items: [],
    status: "idle",
    error: null,
    pagination: {
      currentPage: 1,
      limit: 10,
    },
    totals: {
      totalThreads: 0,
      totalRequests: 0,
      totalMembers: 0,
    },
  },

  sidebar: {
    items: [],
    status: "idle",
    error: null,
  },

  community: {
    item: null,
    status: "idle",
    error: null,
    totals: {
      totalThreads: 0,
      totalRequests: 0,
      totalMembers: 0,
    },
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
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/communities?page=${page}&limit=${limit}`
      );
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      }
      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);

export const getSidebarCommunities = createAsyncThunk(
  "communitySidebar/get",
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/communities?page=${page}&limit=${limit}`
      );
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
        //pagination: response.data.pagination,
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
  reducers: {
    clearCommunity: (state) => {
      state.communities.items = [];
      state.communities.status = "idle";
      state.communities.error = null;
      state.community.item = null
      state.community.status = "idle";
      state.community.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createCommunity.pending, (state) => {
        state.communities.status = "loading";
      })

      .addCase(createCommunity.fulfilled, (state, action) => {
        state.communities.status = "succeeded";
        state.communities.items.push(action.payload.data);
        state.communities.error = null;
      })

      .addCase(createCommunity.rejected, (state, action) => {
        state.communities.status = "failed";
        state.communities.error =
          (action.payload as string) || "Failed to create community";
      })

      .addCase(getCommunities.pending, (state) => {
        state.communities.status = "loading";
      })

      .addCase(getCommunities.fulfilled, (state, action) => {
        state.communities.status = "succeeded";
        state.communities.items = action.payload.data;
        state.communities.pagination = action.payload.pagination;
        state.communities.error = null;
      })

      .addCase(getCommunities.rejected, (state, action) => {
        state.communities.status = "failed";
        state.communities.error =
          (action.payload as string) || "Failed to create community";
      })

      .addCase(getSidebarCommunities.pending, (state) => {
        state.sidebar.status = "loading";
      })

      .addCase(getSidebarCommunities.fulfilled, (state, action) => {
        state.sidebar.status = "succeeded";
        state.sidebar.items = action.payload.data;
        //state.sidebar.pagination = action.payload.pagination;
        state.sidebar.error = null;
      })

      .addCase(getSidebarCommunities.rejected, (state, action) => {
        state.sidebar.status = "failed";
        state.sidebar.error =
          (action.payload as string) || "Failed to create community";
      })

      .addCase(getCommunityById.pending, (state) => {
        state.community.status = "loading";
      })

      .addCase(getCommunityById.fulfilled, (state, action) => {
        (state.community.status = "succeeded"),
          (state.community.item = action.payload.data.community);
        state.community.totals.totalMembers =
          action.payload.data.totalMembers || 0;
        state.community.totals.totalRequests =
          action.payload.data.totalRequests || 0;
        state.community.totals.totalThreads =
          action.payload.data.totalThreads || 0;
        //state.community.pagination = action.payload.data.pagination;
        state.community.error = null;
      })

      .addCase(getCommunityById.rejected, (state, action) => {
        (state.community.status = "failed"),
          (state.community.error =
            (action.payload as string) || "Failed to get a community");
      })

      .addCase(sendJoinRequest.pending, (state) => {
        state.community.status = "loading";
      })

      .addCase(sendJoinRequest.fulfilled, (state, action) => {
  state.community.status = "succeeded";
  if (state.community.item) {
    
    state.community.item.requests = action.payload.data.requests;
    state.community.item.members = action.payload.data.members;
    state.community.totals.totalMembers = action.payload.data.totalMembers;
    state.community.totals.totalRequests = action.payload.data.totalRequests;
    state.community.totals.totalThreads = action.payload.data.totalThreads;
  }
})

      .addCase(sendJoinRequest.rejected, (state, action) => {
        state.community.status = "failed";
        state.community.error =
          (action.payload as string) || "failed to send join request";
      })

      .addCase(joinRequestDecision.pending, (state) => {
        state.community.status = "loading";
      })

      .addCase(joinRequestDecision.fulfilled, (state, action) => {
        state.community.status = "succeeded";
        if (state.community.item) {
          state.community.item.requests = action.payload.data.requests;
          state.community.item.members = action.payload.data.members;
          state.community.totals.totalMembers =
            action.payload.data.totalMembers || 0;
          state.community.totals.totalRequests =
            action.payload.data.totalRequests || 0;
          state.community.totals.totalThreads =
            action.payload.data.totalThreads || 0;
        }
      })
      .addCase(joinRequestDecision.rejected, (state, action) => {
        state.community.status = "failed";
        state.community.error =
          (action.payload as string) || "Failed to select decision";
      });
  },
});

export default communitySlice.reducer;
export const { clearCommunity } = communitySlice.actions;
