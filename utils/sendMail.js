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

const sendDonationConfirmationEmail = async (toEmail, donorName, quantity, bloodGroup, orgName) => {
  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Blood Donation Request Submitted',
    html: `
      <p>Dear ${donorName},</p>
      <p>Your request to donate <strong>${quantity}ml</strong> of <strong>${bloodGroup}</strong> blood has been submitted to <strong>${orgName}</strong>.</p>
      <p>You will be notified once your request is reviewed and approved.</p>
      <br>
      <p>Thank you for your willingness to save lives.</p>
      <br>
      <p>Regards,<br>Blood Bank Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
const sendDonationApprovalEmail = async (toEmail, donorName, bloodGroup, quantity, orgName) => {
  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Your Blood Donation Request has been Approved',
    html: `
      <p>Dear ${donorName},</p>
      <p>Your blood donation request for <strong>${quantity}ml</strong> of <strong>${bloodGroup}</strong> has been approved by <strong>${orgName}</strong>.</p>
      <p>Thank you for being a life saver!</p>
      <br>
      <p>Regards,<br>Blood Bank Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
const sendDonationRejectionEmail = async (toEmail, donorName, bloodGroup, quantity, orgName) => {
  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Your Blood Donation Request was Rejected',
    html: `
      <p>Dear ${donorName},</p>
      <p>We regret to inform you that your donation request for <strong>${quantity}ml</strong> of <strong>${bloodGroup}</strong> has been rejected by <strong>${orgName}</strong>.</p>
      <p>This could be due to availability, eligibility, or other operational reasons.</p>
      <p>We deeply appreciate your willingness to help. Please feel free to try again later or reach out to other nearby organisations.</p>
      <br>
      <p>Regards,<br>Blood Bank Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
const sendHospitalRequestEmail = async (toEmail, hospitalName, organisationName, quantity, bloodGroup, reason, orgLocation) => {
  const fullAddress = `
    ${orgLocation?.location}, ${orgLocation?.city}, ${orgLocation?.district},
    ${orgLocation?.state}, ${orgLocation?.country}
  `.replace(/undefined|null/g, "").replace(/\s+,/g, "");

  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Blood Request Submitted Successfully',
    html: `
      <p>Dear ${hospitalName},</p>
      <p>Your blood request has been successfully submitted.</p>
      <p><strong>Request Details:</strong></p>
      <ul>
        <li><strong>Requested To:</strong> ${organisationName}</li>
        <li><strong>Blood Group:</strong> ${bloodGroup}</li>
        <li><strong>Quantity:</strong> ${quantity} ml</li>
        <li><strong>Reason:</strong> ${reason}</li>
        <li><strong>Organisation Location:</strong> ${fullAddress}</li>
      </ul>
      <p>We will notify you once the organisation responds. Thank you for using our service.</p>
      <br>
      <p>Regards,<br>Blood Bank Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
const sendHospitalRequestStatusEmail = async (
  toEmail,
  hospitalName,
  orgName,
  status,
  bloodGroup,
  quantity,
  reason,
  remarks
) => {
  const subject = `Your Blood Request has been ${status.toUpperCase()}`;
  const remarkText = status === 'rejected' && remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : "";

  const html = `
    <p>Dear ${hospitalName},</p>
    <p>Your blood request has been <strong>${status.toUpperCase()}</strong> by <strong>${orgName}</strong>.</p>
    <ul>
      <li><strong>Blood Group:</strong> ${bloodGroup}</li>
      <li><strong>Quantity:</strong> ${quantity}ml</li>
      <li><strong>Reason:</strong> ${reason}</li>
    </ul>
    ${remarkText}
    <p>Thank you for using our blood bank service.</p>
    <p>Regards,<br>Blood Bank Team</p>
  `;

  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendApprovalEmail,
  sendDonationConfirmationEmail,
  sendDonationApprovalEmail ,
  sendDonationRejectionEmail,
  sendHospitalRequestEmail,sendHospitalRequestStatusEmail
};


