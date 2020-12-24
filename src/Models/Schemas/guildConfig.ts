import mongoose from "mongoose";

const guildConfigSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  prefix: {
    type: String,
    required: true,
    unique: false,
    default: "r!",
  },
});

export = mongoose.model("server-configs", guildConfigSchema);
