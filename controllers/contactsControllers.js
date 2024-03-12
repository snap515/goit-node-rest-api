import HttpError from "../helpers/HttpError.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../models/contact.js";
import { Contact } from "../models/contact.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

// const getAllContacts = async (req, res) => {
//   const { _id: owner } = req.user;
//   console.log(req.query);
//   const { page = 1, limit = 5 } = req.query;
//   const skip = (page - 1) * limit;
//   const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
//     skip,
//     limit,
//   }).populate("owner", "name email");
//   res.json(result);
// };

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  console.log(req.query);
  const { page = 1, limit = 20, favorite } = req.query;
  console.log(favorite);
  const skip = (page - 1) * limit;
  const result = await Contact.find(
    { owner, favorite },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).populate("owner", "name email");
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  // const result = await Contact.findOne({ _id: id }); для поиска по всему кроме id
  const result = await Contact.findById(id);
  console.log(result);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  console.log(result);
  if (!result) {
    throw HttpError(404);
  }
  // res.status(204).send()
  res.json(result);
};

const createContact = async (req, res) => {
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  // const { name, email, phone } = req.body;
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { error } = updateFavoriteSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
