import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  createAt: { type: Date, default: Date.now },
});

export default mongoose.model("scoreSchemas", ScoreSchema);
