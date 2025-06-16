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
const sendRejectionEmail = async (toEmail, patientName, patientId, rejectionReason, orgDetails) => {
  const { name, contact, email, address } = orgDetails;

  const orgFullAddress = `
    ${address.location}, ${address.city}, ${address.district}, 
    ${address.state}, ${address.country}
  `.replace(/undefined|null/g, "").replace(/\s+,/g, ""); // clean formatting

  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Your Emergency Blood Request was Rejected',
    html: `
      <p>Dear ${patientName},</p>

      <p>We regret to inform you that your emergency blood request (Patient ID: <strong>${patientId}</strong>) has been <strong>rejected</strong> by the following organisation:</p>

      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Contact:</strong> ${contact}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Address:</strong> ${orgFullAddress}</li>
      </ul>

      <p><strong>Reason for Rejection:</strong> ${rejectionReason}</p>

      <p>If you believe this was a mistake or need further help, please contact the organisation directly or consider submitting another request after 72 hours.</p>

      <br>
      <p>We hope you get the help you need soon.</p>

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
const sendDonationApprovalEmail = async (
  toEmail,
  donorName,
  bloodGroup,
  quantity,
  orgName,
  orgEmail,
  orgPhone,
  orgAddress
) => {
  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Your Blood Donation Request Has Been Approved – Next Steps',
    html: `
      <p>Dear ${donorName},</p>
      <p>We are pleased to inform you that your blood donation request for <strong>${quantity}ml</strong> of <strong>${bloodGroup}</strong> has been <strong>approved</strong> by <strong>${orgName}</strong>.</p>
      
      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Contact <strong>${orgName}</strong> to schedule your donation appointment.</li>
        <li>Organisation Contact:</li>
        <ul>
          <li><strong>Email:</strong> ${orgEmail}</li>
          <li><strong>Phone:</strong> ${orgPhone}</li>
          <li><strong>Address:</strong> ${orgAddress}</li>
        </ul>
        <li>Bring a valid photo ID and any previous medical or blood donation documents (if available).</li>
        <li>Ensure you are well-rested, hydrated, and have eaten before arriving.</li>
      </ul>

      <p>If you have any questions, feel free to reach out directly to the organisation using the contact info above.</p>

      <p>Thank you for stepping up — your contribution can truly save lives.</p>

      <br>
      <p>Warm regards,<br>Blood Bank Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendDonationRejectionEmail = async (
  toEmail,
  donorName,
  bloodGroup,
  quantity,
  orgName,
  orgEmail,
  orgPhone,
  orgAddress,
  reason
) => {
  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Update on Your Blood Donation Request',
    html: `
      <p>Dear ${donorName},</p>

      <p>Thank you for your willingness to donate <strong>${quantity}ml</strong> of <strong>${bloodGroup}</strong>. Unfortunately, your donation request has been <strong>rejected</strong> by <strong>${orgName}</strong>.</p>

      <p><strong>Reason for Rejection:</strong><br>${reason}</p>

      <p>Please don’t be discouraged — your intention to help is incredibly valuable and appreciated. We encourage you to:</p>
      <ul>
        <li>Review your contact and health details to ensure accuracy.</li>
        <li>Try again after a few days or apply to another nearby organisation.</li>
        <li>Reach out to ${orgName} if you’d like further clarification.</li>
      </ul>
      <li>Organisation Contact:</li>
        <ul>
          <li><strong>Email:</strong> ${orgEmail}</li>
          <li><strong>Phone:</strong> ${orgPhone}</li>
          <li><strong>Address:</strong> ${orgAddress}</li>
        </ul>

      <p>Your willingness to support others in need is what keeps this mission alive.</p>

      <br>
      <p>Warm regards,<br>Blood Bank Team</p>
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

const sendDonationSuccessEmail = async (
  donorEmail,
  donorName,
  bloodGroup,
  quantity,
  organisationName
) => {
 

    const mailOptions = {
      from: `"${organisationName}" <${process.env.SMTP_MAIL}>`,
      to: donorEmail,
      subject: "Thank You for Your Blood Donation!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2 style="color: #d32f2f;">Donation Completed Successfully</h2>
          <p>Dear ${donorName},</p>
          <p>We are happy to inform you that your recent blood donation request has been <strong>successfully fulfilled</strong>.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li><strong>Blood Group:</strong> ${bloodGroup}</li>
            <li><strong>Quantity:</strong> ${quantity} ml</li>
            <li><strong>Organisation:</strong> ${organisationName}</li>
          </ul>
          <p>Thank you once again for your life-saving contribution. 💉</p>
          <p>With gratitude,<br/>${organisationName} Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

};

const sendEmergencyRequestCreatedEmail = async (
  toEmail,
  name,
  bloodGroup,
  quantity,
  urgency,
  address
) => {
  const fullAddress = `
    ${address.manualAddress || ""}, ${address.city}, ${address.state}, ${address.country}
  `.replace(/undefined|null/g, "").replace(/\s+,/g, "");

  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Emergency Blood Request Submitted",
    html: `
      <p>Dear ${name},</p>
      <p>Your emergency blood request has been submitted successfully.</p>
      <p><strong>Request Details:</strong></p>
      <ul>
        <li><strong>Blood Group:</strong> ${bloodGroup}</li>
        <li><strong>Quantity:</strong> ${quantity} ml</li>
        <li><strong>Urgency:</strong> ${urgency}</li>
        <li><strong>Address:</strong> ${fullAddress}</li>
      </ul>
      <p>Our team will review your request shortly. Keep your Patient ID safe for tracking.</p>
      <br>
      <p>Regards,<br>Blood Bank Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
const sendAdminApprovalEmail = async (toEmail, name, bloodGroup, quantity) => {
  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: `Your Emergency Blood Request Has Been Approved`,
    html: `
      <p>Dear ${name},</p>

      <p>We are pleased to inform you that your emergency blood request has been <strong>approved</strong> by our admin team.</p>

      <ul>
        <li><strong>Blood Group:</strong> ${bloodGroup}</li>
        <li><strong>Quantity:</strong> ${quantity} ml</li>
      </ul>

      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Your request will now be forwarded to nearby blood banks and organisations based on your location.</li>
        <li>You will be notified once a blood bank accepts your request.</li>
        <li>The accepting organisation will contact you directly through your registered details.</li>
      </ul>

      <p>We are working to ensure you receive assistance as soon as possible.</p>

      <br>
      <p>Regards,<br><strong>Blood Bank Team</strong></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
const sendAdminRejectionEmail = async (toEmail, name, bloodGroup, quantity) => {
  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: `Your Emergency Blood Request Has Been Rejected`,
    html: `
      <p>Dear ${name},</p>

      <p>We regret to inform you that your emergency blood request has been <strong>rejected</strong> by our admin team after review.</p>

      <ul>
        <li><strong>Blood Group:</strong> ${bloodGroup}</li>
        <li><strong>Quantity:</strong> ${quantity} ml</li>
      </ul>

      <p>If you believe this was a mistake or require urgent assistance, please contact our support team or try submitting a new request after 72 hours.</p>

      <p>We appreciate your understanding.</p>

      <br>
      <p>Regards,<br><strong>Blood Bank Team</strong></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendEmergencyRequestFulfilledEmail = async (toEmail, patientName, patientId, orgDetails) => {
  const { name, contact, email, address } = orgDetails;

  const orgFullAddress = `
    ${address.location}, ${address.city}, ${address.district}, 
    ${address.state}, ${address.country}
  `.replace(/undefined|null/g, "").replace(/\s+,/g, ""); // clean formatting

  const mailOptions = {
    from: `"Blood Bank Service" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Your Emergency Blood Request Has Been Fulfilled',
    html: `
      <p>Dear ${patientName},</p>

      <p>We're happy to inform you that your emergency blood request (Patient ID: <strong>${patientId}</strong>) has been successfully <strong>fulfilled</strong> by the following organisation:</p>

      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Contact:</strong> ${contact}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Address:</strong> ${orgFullAddress}</li>
      </ul>

      <p>We hope this support has made a difference. Thank you for trusting our service during your time of need.</p>

      <br>
      <p>Wishing you a speedy recovery,<br><strong>Blood Bank Team</strong></p>
    `
  };

  await transporter.sendMail(mailOptions);
};


module.exports = {
  sendApprovalEmail,
  sendDonationConfirmationEmail,
  sendDonationApprovalEmail ,
  sendDonationRejectionEmail,
  sendHospitalRequestEmail,sendHospitalRequestStatusEmail,
  sendDonationSuccessEmail,sendEmergencyRequestCreatedEmail,sendAdminRejectionEmail,sendAdminApprovalEmail,sendRejectionEmail,sendEmergencyRequestFulfilledEmail
};


