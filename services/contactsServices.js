import path from "path";
import fs from "fs/promises";

import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContact() {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

export async function getContactById(contactId) {
  const contacts = await listContact();
  const result = contacts.find((item) => item.id === contactId);
  return result || null;
}

export async function addContact(name, email, phone) {
  const contacts = await listContact();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

export async function removeContact(contactId) {
  const contacts = await listContact();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}
