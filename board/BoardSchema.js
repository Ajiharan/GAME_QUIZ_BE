import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  highScore: {
    type: Number,
    required: true,
  },
  createAt: { type: Date, default: Date.now },
});

export default mongoose.model("boardSchemas", BoardSchema);
