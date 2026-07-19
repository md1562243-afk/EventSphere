const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  // No SMTP credentials configured — fall back to a console logger so the
  // rest of the app keeps working in local/dev environments.
  transporter = {
    sendMail: async (options) => {
      console.log('--- EMAIL (SMTP not configured, logging instead) ---');
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log('------------------------------------------------------');
      return { messageId: 'console-log' };
    }
  };
}

module.exports = transporter;
