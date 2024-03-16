import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import path from "path";
// import fs from "fs";
import fs from "fs/promises";
import Jimp from "jimp";

import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

dotenv.config();
const { SECRET_KEY } = process.env;

// const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const avatarsDir = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  console.log(newUser);
  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;
  res.json({ email, name });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Logout success" });
};

const updateSub = async (req, res) => {
  const { subscription } = req.body;
  const userId = req.user._id;
  const result = await User.findByIdAndUpdate(
    userId,
    { subscription },
    { new: true }
  );
  console.log(result);
  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  console.log("tempUpload", tempUpload);
  console.log("avatarsDir", avatarsDir);
  console.log("originalName", originalname);
  console.log("filename", filename);
  console.log("resultUpload", resultUpload);

  await Jimp.read(tempUpload)
    .then((image) => {
      return image.resize(250, Jimp.AUTO);
    })
    .then((image) => {
      return image.write(resultUpload);
    });

  await fs.unlink(tempUpload);

  // await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  console.log("avatarURL", avatarURL);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSub: ctrlWrapper(updateSub),
  updateAvatar: ctrlWrapper(updateAvatar),
};
