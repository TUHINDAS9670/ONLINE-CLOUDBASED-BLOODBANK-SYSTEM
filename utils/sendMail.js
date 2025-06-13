const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // your Gmail
    pass: process.env.MAIL_PASS  // your App Password
  }
});

const sendApprovalEmail = async (toEmail, patientName, patientId, orgDetails) => {
  const { name, contact, email, address } = orgDetails;

  const orgFullAddress = `
    ${address.location}, ${address.city}, ${address.district}, 
    ${address.state}, ${address.country}
  `.replace(/undefined|null/g, "").replace(/\s+,/g, ""); // clean formatting

  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Your Emergency Blood Request has been Approved',
    html: `
      <p>Dear ${patientName},</p>
      <p>Your emergency blood request (Patient ID: <strong>${patientId}</strong>) has been approved by the following organisation:</p>

      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Contact:</strong> ${contact}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Address:</strong> ${orgFullAddress}</li>
      </ul>

      <p>We’re working to fulfill your request as soon as possible. Please stay available for communication.</p>
          <p>Thank you for trusting our service.</p>

      <br>
      
      <p>Regards,<br>Blood Bank Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};



module.exports = { sendApprovalEmail };
