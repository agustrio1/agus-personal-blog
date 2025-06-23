import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Mailtrap uses STARTTLS, not SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Additional configuration for Mailtrap
  tls: {
    // Do not fail on invalid certs for testing
    rejectUnauthorized: false
  }
})

export async function sendVerificationCode(email: string, code: string) {
  try {
    // Verify SMTP connection configuration
    await transporter.verify()

    const info = await transporter.sendMail({
      from: `"Sistem Verifikasi" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Kode Verifikasi Login",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Kode Verifikasi Login</h1>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 30px; text-align: center;">
            <p style="font-size: 16px; color: #334155; margin-bottom: 20px;">
              Gunakan kode verifikasi berikut untuk melanjutkan login:
            </p>
            
            <div style="background: white; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${code}
              </span>
            </div>
            
            <div style="margin-top: 20px;">
              <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
                ⏰ Kode ini berlaku selama <strong>10 menit</strong>
              </p>
              <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
                🔒 Jangan bagikan kode ini kepada siapa pun
              </p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
              Jika Anda tidak meminta kode ini, abaikan email ini.
              <br>
              Email ini dikirim secara otomatis, mohon jangan membalas.
            </p>
          </div>
        </div>
      `,
      text: `
        Kode Verifikasi Login
        
        Kode verifikasi Anda: ${code}
        
        Kode ini berlaku selama 10 menit.
        Jangan bagikan kode ini kepada siapa pun.
        
        Jika Anda tidak meminta kode ini, abaikan email ini.
      `,
    })
    
    // For Mailtrap, you can also log the preview URL
    if (process.env.NODE_ENV === 'development') {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info))
    }

  } catch (error) {
    console.error("Error sending verification code:", error)
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('EAUTH')) {
        throw new Error("SMTP authentication failed. Please check your credentials.")
      } else if (error.message.includes('ECONNECTION')) {
        throw new Error("Could not connect to SMTP server. Please check your configuration.")
      } else if (error.message.includes('ETIMEDOUT')) {
        throw new Error("SMTP connection timed out. Please try again.")
      }
    }
    
    throw new Error("Failed to send verification code")
  }
}