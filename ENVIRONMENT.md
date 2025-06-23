# Environment Variables Setup

Copy these variables to your `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/personal_blog"
DIRECT_URL="postgresql://username:password@localhost:5432/personal_blog"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration (for 2FA)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT="2525"
SMTP_USER="your-mailtrap-username"
SMTP_PASS="your-mailtrap-password"
FROM_EMAIL="noreply@yourdomain.com"

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-endpoint"
```

## Setup Instructions

### 1. Database (PostgreSQL)
- Install PostgreSQL locally or use a cloud service
- Create a database named `personal_blog`
- Update the connection strings with your credentials

### 2. NextAuth Secret
Generate a secure random string:
```bash
openssl rand -base64 32
```

### 3. Email (Mailtrap for Development)
- Sign up at [Mailtrap.io](https://mailtrap.io)
- Create a new inbox
- Copy SMTP credentials from the inbox settings

### 4. ImageKit
- Sign up at [ImageKit.io](https://imagekit.io)
- Create a new media library
- Copy the public key, private key, and URL endpoint from your dashboard

## Production Considerations

For production deployment:

1. **Database**: Use a managed PostgreSQL service (e.g., Supabase, Neon, Railway)
2. **Email**: Use a production email service (e.g., SendGrid, AWS SES, Resend)
3. **ImageKit**: Your existing ImageKit account works for production
4. **NextAuth Secret**: Use a strong, unique secret for production
5. **NEXTAUTH_URL**: Set to your production domain 