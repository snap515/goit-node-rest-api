import mongoose from "mongoose";

const { Schema, model } = mongoose;

const contactSchema = new Schema({
  name: String,
  email: String,
  phone: Number,
  favourite: Boolean,
});

export const Contact = model("contact", contactSchema);
