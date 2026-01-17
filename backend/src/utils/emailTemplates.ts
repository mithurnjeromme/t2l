
const LOGO_URL = 'https://turn2law.tech/assets/logo.png'; // Make sure this exists or use text
const DASHBOARD_URL = 'https://turn2law.tech/dashboard/client?tab=Track';
const SUPPORT_PHONE = '+91 99061 02527';
const SUPPORT_EMAIL = 'support@turn2law.tech';

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Turn2Law Notification</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px; }
    .header { background-color: #1a1a1a; padding: 20px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
    .content { padding: 30px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    .info-box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .label { font-weight: bold; color: #374151; }
    .value { color: #111827; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Turn2Law</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Turn2Law. All rights reserved.</p>
      <p>Questions? Call us at ${SUPPORT_PHONE} or email ${SUPPORT_EMAIL}</p>
      <p>This is an automated message, please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
`;

export const getServiceReceivedEmail = (userName: string, serviceType: string, serviceNumber: string) => {
    const content = `
    <h2>Request Received Successfully</h2>
    <p>Dear ${userName},</p>
    <p>Thank you for choosing Turn2Law. We have successfully received your request for <strong>${serviceType}</strong>.</p>
    
    <div class="info-box">
      <p><span class="label">Service Request ID:</span> <span class="value">${serviceNumber}</span></p>
      <p><span class="label">Status:</span> <span class="value">Submitted</span></p>
    </div>

    <p>Our legal experts will review your application and get back to you shortly. You can track the real-time status of your request and upload any pending documents via your dashboard.</p>

    <div style="text-align: center;">
      <a href="${DASHBOARD_URL}" class="button">Track Request</a>
    </div>
  `;
    return baseTemplate(content);
};

export const getStatusUpdateEmail = (userName: string, serviceType: string, serviceNumber: string, newStatus: string, notes?: string) => {
    const formattedStatus = newStatus.replace(/_/g, ' ').toUpperCase();
    const content = `
    <h2>Status Update: ${formattedStatus}</h2>
    <p>Dear ${userName},</p>
    <p>The status of your service request for <strong>${serviceType}</strong> (Ref: ${serviceNumber}) has been updated.</p>

    <div class="info-box">
      <p><span class="label">New Status:</span> <span class="value">${formattedStatus}</span></p>
      ${notes ? `<p><span class="label">Note:</span> <span class="value">${notes}</span></p>` : ''}
    </div>

    <p>Please log in to your dashboard to view more details or take any necessary actions.</p>

    <div style="text-align: center;">
      <a href="${DASHBOARD_URL}" class="button">View Dashboard</a>
    </div>
  `;
    return baseTemplate(content);
};

export const getDocumentReceivedEmail = (userName: string, serviceType: string, docName: string) => {
    const content = `
      <h2>Document Received</h2>
      <p>Dear ${userName},</p>
      <p>We have received the document <strong>${docName}</strong> for your <strong>${serviceType}</strong> request.</p>
      <p>Our team will verify it shortly.</p>
  
      <div style="text-align: center;">
        <a href="${DASHBOARD_URL}" class="button">Go to Dashboard</a>
      </div>
    `;
    return baseTemplate(content);
};
