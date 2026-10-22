import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    typr: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  passwoedHash: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
