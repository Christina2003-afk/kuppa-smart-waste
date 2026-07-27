const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;
  
  try {
    // Try to create a transporter using Gmail SMTP with user credentials
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // Verify connection config
    await transporter.verify();
  } catch (error) {
    console.log("⚠️ Gmail verification failed (likely invalid App Password). Falling back to Ethereal Test Email...");
    // Fallback to ethereal email for testing
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Define email options
  const mailOptions = {
    from: `KUPPA App <noreply@kuppa.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Actually send the email
  const info = await transporter.sendMail(mailOptions);
  
  if (info.messageId && info.messageId.includes('ethereal')) {
    console.log("========================================");
    console.log("✉️ TEST EMAIL SENT!");
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("========================================");
    return nodemailer.getTestMessageUrl(info);
  }
  return null;
};

module.exports = sendEmail;
