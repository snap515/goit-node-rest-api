// import { MailService } from "@sendgrid/mail";
// import dotenv from "dotenv";

// dotenv.config();

// const { SENDGRID_API_KEY } = process.env;

// const sgMail = MailService;

// sgMail.setApiKey(SENDGRID_API_KEY);

// export const sendEmail = async (data) => {
//   const email = { ...data, from: "anton.pedan.main@gmail.com" };
//   await sgMail.send(email);
//   return true;
// };

import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (data) => {
  const email = { ...data, from: "anton.pedan.main@gmail.com" };
  await sgMail.send(email);
  return true;
};
