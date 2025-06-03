const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      state: {
        type: String,
        required: true,
        trim: true,
      },
      details: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
