// test-email.js
// Run this script to test your email configuration
// Usage: node test-email.js

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfiguration() {
  console.log('Testing email configuration...');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('FROM_EMAIL:', process.env.FROM_EMAIL);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Mailtrap uses STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    console.log('\n1. Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    // Send test email
    console.log('\n2. Sending test email...');
    const testCode = 'ABC123';
    const info = await transporter.sendMail({
      from: `"Test System" <${process.env.FROM_EMAIL}>`,
      to: 'test@example.com', // This will be caught by Mailtrap
      subject: 'Test Email - Verification Code',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify SMTP configuration.</p>
        <p>Test verification code: <strong>${testCode}</strong></p>
        <p>If you receive this, your email configuration is working!</p>
      `,
      text: `Test Email - Verification code: ${testCode}`
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // For Mailtrap, show preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Preview URL:', previewUrl);
    }

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('   - SMTP_USER and SMTP_PASS are correct');
      console.log('   - Your Mailtrap credentials are active');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Connection failed. Please check:');
      console.log('   - SMTP_HOST and SMTP_PORT are correct');
      console.log('   - Your internet connection');
    }
  }
}

testEmailConfiguration();