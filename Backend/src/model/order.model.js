import mongoose, { Schema } from "mongoose";

// Define schema correctly using `new Schema`
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  frameSize: {
    type: String,
    required: true,
  },
  image: {
    type: String, //Couldinary URL
    required: true,
  },
  notes: {
    type: String,
    required: false,
  }
},{timestamps:true});


export const User = mongoose.model("User", userSchema)