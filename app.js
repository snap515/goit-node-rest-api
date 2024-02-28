import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";

import contactsRouter from "./routes/contactsRouter.js";

export const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const DB_HOST =
  "mongodb+srv://Anton:mKbQy7e0E9GjTiEQ@cluster1.l8blfiy.mongodb.net/contacts_reader?retryWrites=true&w=majority&appName=Cluster1";

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
