import mongoose from "mongoose";
import { Children } from "react";
import { required } from "zod/v4-mini";

const threadSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  parentId: {
    type: String,
  },

  message: {
    type: String,
    required: true,
  },

  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],

  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Communities",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
