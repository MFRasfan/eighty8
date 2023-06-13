const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({subject, email,text, html, code}) => {
    const msg = {
      to: email,
      from: process.env.SENDGRID_EMAIL,
      subject: subject,
      text: text || `Your OTP code is ${code}. This code will expire in 1 hour.`,
      html:  html || `<p>Your OTP code is <strong>${code}</strong>. This code will expire in 1 hour.</p>`,
    };
    await sgMail.send(msg);
  };

  module.exports={sendEmail}