/**
 * @author Arpit Bhalla
 */

import nodemailer, { SendMailOptions, SentMessageInfo } from "nodemailer";
import chalk from "chalk";

export const sendMail = async (
  options: SendMailOptions = {}
): Promise<SentMessageInfo> => {
  let testAccount = await nodemailer.createTestAccount();
  console.log(
    process.env.EMAIL_SERVER && chalk.red.bold("Using Prod EMail Service")
  );

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER || "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME || testAccount.user,
      pass: process.env.EMAIL_PASSWORD || testAccount.pass,
    },
  });

  let info = await transporter.sendMail(options);

  if (process.env.DEV) {
    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  return info;
};
