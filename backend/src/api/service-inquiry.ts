import { Router, Request, Response } from 'express';
import { Resend } from 'resend';

const router = Router();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface ServiceInquiry {
  serviceName: string;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  businessType?: string;
  pan?: string;
  gstin?: string;
  returnType?: string;
  selectedPlan?: string;
  message?: string;
}

// Email sending function using Resend
const sendServiceInquiryEmail = async (inquiry: ServiceInquiry) => {
  try {
    console.log('='.repeat(80));
    console.log('[SERVICE INQUIRY] Sending inquiry to Turn2Law');
    console.log('[SERVICE INQUIRY] Service:', inquiry.serviceName);
    console.log('[SERVICE INQUIRY] Customer:', inquiry.name, inquiry.email);
    console.log('='.repeat(80));

    // Format the inquiry details as HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #EAB308 0%, #CA8A04 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px; }
          .label { font-weight: bold; color: #EAB308; }
          .value { color: #333; margin-top: 5px; }
          .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Service Inquiry</h1>
            <p style="margin: 0;">Turn2Law Service Request</p>
          </div>
          <div class="content">
            <h2 style="color: #EAB308; margin-top: 0;">Service Requested: ${inquiry.serviceName}</h2>
            
            <div class="field">
              <div class="label">👤 Full Name:</div>
              <div class="value">${inquiry.name}</div>
            </div>
            
            <div class="field">
              <div class="label">📧 Email Address:</div>
              <div class="value">${inquiry.email}</div>
            </div>
            
            <div class="field">
              <div class="label">📱 Phone Number:</div>
              <div class="value">${inquiry.phone}</div>
            </div>
            
            ${inquiry.businessName ? `
            <div class="field">
              <div class="label">🏢 Business Name:</div>
              <div class="value">${inquiry.businessName}</div>
            </div>
            ` : ''}
            
            ${inquiry.businessType ? `
            <div class="field">
              <div class="label">🏛️ Business Type:</div>
              <div class="value">${inquiry.businessType}</div>
            </div>
            ` : ''}
            
            ${inquiry.pan ? `
            <div class="field">
              <div class="label">🆔 PAN Number:</div>
              <div class="value">${inquiry.pan}</div>
            </div>
            ` : ''}
            
            ${inquiry.gstin ? `
            <div class="field">
              <div class="label">📋 GSTIN:</div>
              <div class="value">${inquiry.gstin}</div>
            </div>
            ` : ''}
            
            ${inquiry.returnType ? `
            <div class="field">
              <div class="label">📄 Return Type:</div>
              <div class="value">${inquiry.returnType}</div>
            </div>
            ` : ''}
            
            ${inquiry.selectedPlan ? `
            <div class="field">
              <div class="label">💼 Selected Plan:</div>
              <div class="value">${inquiry.selectedPlan}</div>
            </div>
            ` : ''}
            
            ${inquiry.message ? `
            <div class="field">
              <div class="label">💬 Additional Message:</div>
              <div class="value">${inquiry.message}</div>
            </div>
            ` : ''}
            
            <div class="footer">
              <p>This inquiry was submitted via Turn2Law website on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
              <p>Please respond to the customer within 24 hours for best service experience.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Turn2Law Services <services@send.turn2law.tech>',
      to: ['turn2law@gmail.com'],
      replyTo: inquiry.email,
      subject: `🔔 New ${inquiry.serviceName} Inquiry from ${inquiry.name}`,
      html: htmlContent,
    });

    if (error) {
      console.error('[SERVICE INQUIRY] Resend API error:', error);
      throw error;
    }
    
    console.log('[SERVICE INQUIRY] Email sent successfully!');
    console.log('[SERVICE INQUIRY] Email ID:', data?.id);
    return data;
  } catch (error) {
    console.error('[SERVICE INQUIRY] Failed to send email:', error);
    throw error;
  }
};

/**
 * POST /api/service-inquiry
 * Submit a service inquiry form
 */
router.post('/service-inquiry', async (req: Request, res: Response) => {
  try {
    const inquiryData: ServiceInquiry = req.body;

    // Validate required fields
    if (!inquiryData.serviceName || !inquiryData.name || !inquiryData.email || !inquiryData.phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['serviceName', 'name', 'email', 'phone']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquiryData.email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(inquiryData.phone)) {
      return res.status(400).json({
        error: 'Invalid phone number format'
      });
    }

    // Send inquiry email to Turn2Law
    await sendServiceInquiryEmail(inquiryData);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Your inquiry has been submitted successfully! We will contact you within 24 hours.',
      inquiryDetails: {
        serviceName: inquiryData.serviceName,
        customerName: inquiryData.name,
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('[SERVICE INQUIRY] Error processing inquiry:', error);
    return res.status(500).json({
      error: 'Failed to submit inquiry',
      message: 'Please try again later or contact us directly at turn2law@gmail.com',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
