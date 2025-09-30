import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";



const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  email:{
    type: String,
   unique: true
  }, 

  username: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true,
  },

 profile_picture : String,

  bio: String,

  onboarded: {
    type: Boolean,
    default: false,
  },

  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],

  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Communities",
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
