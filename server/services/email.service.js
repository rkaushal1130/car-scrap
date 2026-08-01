const createTransporter = require('../config/email.config');

const sendAdminInquiryNotification = async (inquiryData) => {
  try {
    const transporter = createTransporter();
    const fromAddress = `"${process.env.FROM_NAME || 'Car Scrap Platform'}" <${process.env.FROM_EMAIL || 'noreply@carscrap.com'}>`;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.FROM_EMAIL || 'admin@carscrap.com';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0D7A41;">🚗 New Vehicle Scrap Inquiry Received</h2>
        <p>A new customer lead has been submitted on the platform.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Inquiry ID:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryData.inquiryNumber}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Customer Name:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryData.fullName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryData.phone}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryData.email || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Location:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryData.location}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Vehicle Details:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryData.vehicleDetails}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Category:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryData.category.toUpperCase()}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Fuel Type:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryData.fuelType.toUpperCase()}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Condition:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryData.condition.toUpperCase()}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Valuation Range:</td><td style="padding: 8px; border-bottom: 1px solid #ddd; color: #0D7A41; font-weight: bold;">₹${inquiryData.estimatedValuation.min.toLocaleString()} - ₹${inquiryData.estimatedValuation.max.toLocaleString()}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">CO2 Emission Saved:</td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${inquiryData.estimatedValuation.co2Saved}</td></tr>
        </table>

        <p style="margin-top: 20px;">Log in to the admin panel to update lead status and assign agents.</p>
      </div>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: `[New Scrap Inquiry] ${inquiryData.inquiryNumber} - ${inquiryData.fullName}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Failed to send admin notification email:', error.message);
  }
};

const sendCustomerValuationReceipt = async (inquiryData) => {
  if (!inquiryData.email) return;

  try {
    const transporter = createTransporter();
    const fromAddress = `"${process.env.FROM_NAME || 'Car Scrap Platform'}" <${process.env.FROM_EMAIL || 'noreply@carscrap.com'}>`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; rounded: 8px;">
        <h2 style="color: #0D7A41;">Your Vehicle Scrap Valuation Quote</h2>
        <p>Dear ${inquiryData.fullName},</p>
        <p>Thank you for requesting a scrap valuation with us. Here is your estimated valuation breakdown:</p>
        
        <div style="background-color: #F0FDF4; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #BBF7D0;">
          <h3 style="margin: 0; color: #166534;">Estimated Scrap Value</h3>
          <p style="font-size: 24px; font-weight: bold; color: #0D7A41; margin: 10px 0 5px 0;">
            ₹${inquiryData.estimatedValuation.min.toLocaleString()} - ₹${inquiryData.estimatedValuation.max.toLocaleString()}
          </p>
          <p style="margin: 0; color: #15803D; font-size: 14px;">🌱 Environmental Impact: <strong>${inquiryData.estimatedValuation.co2Saved}</strong></p>
        </div>

        <p><strong>Reference Number:</strong> ${inquiryData.inquiryNumber}</p>
        <p>Our team will contact you shortly at <strong>${inquiryData.phone}</strong> to confirm your vehicle details, arrange legal RTO paperwork, and schedule free doorstep pickup.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777;">Car Scrap & Recycling Enterprise Platform</p>
      </div>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: inquiryData.email,
      subject: `Your Vehicle Scrap Valuation Quote #${inquiryData.inquiryNumber}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error('Failed to send customer receipt email:', error.message);
  }
};

module.exports = {
  sendAdminInquiryNotification,
  sendCustomerValuationReceipt,
};
