// backend/utils/mailer.js
const nodemailer = require('nodemailer');

let etherealAccount = null;

async function getTransporter() {
  // ALWAYS use streamTransport when NOT in production
  if (process.env.NODE_ENV !== 'production') {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });
  }

  // In production, create (or reuse) your Ethereal test account
  if (!etherealAccount) {
    etherealAccount = await nodemailer.createTestAccount();
    console.log('🧪 Ethereal credentials:');
    console.log('   user:', etherealAccount.user);
    console.log('   pass:', etherealAccount.pass);
  }

  return nodemailer.createTransport({
    host: etherealAccount.smtp.host,
    port: etherealAccount.smtp.port,
    secure: etherealAccount.smtp.secure,
    auth: {
      user: etherealAccount.user,
      pass: etherealAccount.pass,
    },
  });
}

/**
 * Send a mail and in development print the raw MIME, in production return the Ethereal preview URL.
 */
async function sendMail(to, subject, html) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: '"Playbooker" <no-reply@playbooker.local>',
    to,
    subject,
    html,
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('✉️  [dev] Raw email contents:\n');
    console.log(info.message.toString());
    return null;
  } else {
    console.log('✉️  Message sent:', info.messageId);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('📬 Preview URL:', previewUrl);
    return previewUrl;
  }
}

module.exports = { sendMail };
