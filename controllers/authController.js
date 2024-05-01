import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

import path from "path";

dotenv.config();
const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationCode,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<div style="font-family: Arial, sans-serif;">
      <h2 style="color: #007bff;">Welcome to Our App!</h2>
      <p>
        Hello ${name},<br>
        Thank you for registering with us!<br>
        To complete your registration, please click the link below to verify your email address:
      </p>
      <p>
        <a href="${BASE_URL}/api/auth/verify/${verificationCode}" style="color: #28a745; text-decoration: none;">Click here to verify</a>
      </p>
      <p>
        If you did not sign up for our service, you can safely ignore this email.
      </p>
      <p>
        Best regards,<br>
        The Our App Team
      </p>
    </div>`,
  };

  await sendEmail(verifyEmail);

  console.log(newUser);
  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
  });
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  console.log("req body ", req.body);
  const user = await User.findOne({ verificationCode });
  console.log("user", user);
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  // res.json({ message: "Verification successful" });
  const templatePath = path.join(
    __dirname,
    "..",
    "ejs-pages",
    "verification-success.ejs"
  );

  // Отправляем файл шаблона клиенту
  res.sendFile(templatePath);
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing required field email");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click to verify</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email was send successfully",
  });
};

const login = async (req, res) => {
  const { email, password, name } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
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
    email,
    name,
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

export default {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSub: ctrlWrapper(updateSub),
};
