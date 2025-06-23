# Personal Blog with Next.js

A modern personal blog built with Next.js 15, Prisma, NextAuth, and TypeScript.

## Features

### Authentication & Security
- ✅ NextAuth.js integration with credentials provider
- ✅ Two-factor authentication (2FA) via email verification
- ✅ Secure password hashing with Argon2
- ✅ Account lockout protection
- ✅ Protected routes with AuthGuard

### Dashboard
- ✅ Modern responsive dashboard layout
- ✅ Sidebar navigation
- ✅ Statistics overview
- ✅ Quick actions

### Content Management
- ✅ **Categories Management**
  - CRUD operations for categories
  - Automatic slug generation
  - Pagination support

- ✅ **Projects Management**
  - Create, edit, delete projects
  - **Image upload with WebP optimization**
  - Category assignment
  - Project links
  - Visual card layout with image previews

- ✅ **Posts Management** (Coming soon)
  - Rich text editor
  - Image upload support
  - Category assignment

### Image Handling
- ✅ **ImageKit integration** for cloud image storage
- ✅ **Automatic image optimization**:
  - Converts all images to WebP format
  - Compresses images (quality: 80, effort: 6)
  - Resizes to max 1200x800px
  - Maintains aspect ratio
- ✅ **File validation**:
  - Image files only (PNG, JPG, GIF)
  - Max file size: 5MB
- ✅ **Real-time preview** during upload

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Storage**: ImageKit
- **Image Processing**: Sharp (for WebP conversion)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Email (for 2FA)
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT="2525"
SMTP_USER="your-mailtrap-user"
SMTP_PASS="your-mailtrap-pass"
FROM_EMAIL="noreply@yourdomain.com"

# ImageKit
IMAGEKIT_PUBLIC_KEY="your-imagekit-public-key"
IMAGEKIT_PRIVATE_KEY="your-imagekit-private-key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-endpoint"
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and fill in your values

3. **Set up database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
app/
├── api/
│   ├── auth/           # Authentication APIs
│   ├── categories/     # Category CRUD APIs
│   ├── projects/       # Project CRUD APIs
│   └── posts/          # Post CRUD APIs
├── dashboard/          # Dashboard pages
│   ├── categories/     # Category management
│   ├── projects/       # Project management
│   └── posts/          # Post management
└── globals.css         # Global styles

components/
├── auth/               # Authentication components
├── layout/             # Layout components
├── projects/           # Project-specific components
├── categories/         # Category-specific components
└── ui/                 # Reusable UI components

lib/
├── auth.ts            # NextAuth configuration
├── db.ts              # Prisma client
├── imagekit.ts        # ImageKit configuration
└── utils.ts           # Utility functions
```

## Image Upload Features

### WebP Optimization
- All uploaded images are automatically converted to WebP format
- Compression settings: quality 80%, effort level 6
- Maximum dimensions: 1200x800px (maintains aspect ratio)
- File size reduction: typically 60-80% smaller than original

### Upload Process
1. User selects image file
2. Client-side validation (file type, size)
3. Upload to `/api/projects/upload-image`
4. Server processes image with Sharp:
   - Converts to WebP
   - Compresses and resizes
   - Uploads to ImageKit
5. Returns optimized image URL
6. Updates form with new image URL

### Benefits
- **Performance**: Smaller file sizes load faster
- **SEO**: WebP is preferred by search engines
- **Bandwidth**: Reduced bandwidth usage
- **Quality**: Maintains good visual quality
- **Compatibility**: WebP is supported by all modern browsers

## API Endpoints

### Projects
- `GET /api/projects` - List projects with pagination
- `POST /api/projects` - Create new project
- `GET /api/projects/[slug]` - Get project by slug
- `PUT /api/projects/[slug]` - Update project
- `DELETE /api/projects/[slug]` - Delete project
- `POST /api/projects/upload-image` - Upload project image

### Categories
- `GET /api/categories` - List categories with pagination
- `POST /api/categories` - Create new category
- `GET /api/categories/[slug]` - Get category by slug
- `PUT /api/categories/[slug]` - Update category
- `DELETE /api/categories/[slug]` - Delete category

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
