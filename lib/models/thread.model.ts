import mongoose from "mongoose";



const threadSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  parentId: {
    type: String,
  },

  thread: {
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
