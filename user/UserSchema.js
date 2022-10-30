import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createAt: { type: Date, default: Date.now },
});

export default mongoose.model("userSchemas", UserSchema);
