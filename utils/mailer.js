// backend/utils/mailer.js
const nodemailer = require('nodemailer');

async function getTransporter() {
  // Si tienes SMTP real configurado, úsalo (Gmail)
  if (process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,              // smtp.gmail.com
      port: Number(process.env.MAIL_PORT) || 587,
      secure: process.env.MAIL_SECURE === 'true', // false para 587
      auth: {
        user: process.env.MAIL_USER,            // tu.email@gmail.com
        pass: process.env.MAIL_PASS,            // tu App Password
      },
    });
  }

  // Modo dev: imprime raw MIME en consola
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
}

async function sendMail(to, subject, html) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });

  // Si no hay MAIL_HOST, estamos en modo dev sin SMTP real
  if (!process.env.MAIL_HOST) {
    console.log('✉️  [dev] Raw email:\n', info.message.toString());
    return null;
  }

  console.log('✉️  Email enviado, messageId:', info.messageId);
  return info.messageId;
}

module.exports = { sendMail };
