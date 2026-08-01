const { createTransporter } = require('../config/email.config');

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'Car Scrap Platform'}" <${process.env.FROM_EMAIL || 'noreply@carscrap.com'}>`,
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error) {
    console.error('Email send error:', error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
};
