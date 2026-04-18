# Luxe Interior Studio — Full MERN Stack Website

## 🚀 Quick Start

```bash
# 1. Backend
cd server
cp .env.example .env       # Fill in Mongo + Cloudinary credentials
npm install
npm run seed               # Creates admin@luxe.in / Admin@1234
npm run dev                # → http://localhost:5000

# 2. Frontend
cd client
npm install
npm start                  # → http://localhost:3000
```

---

## ☁️ Cloudinary Setup (Required for image uploads)

1. Sign up free at **https://cloudinary.com** (25GB free storage)
2. Go to **Dashboard** → copy your 3 credentials
3. Paste into `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Cloudinary Folder Structure
All uploads are auto-organised into separate folders:

| Folder | Used For | Max Size |
|--------|----------|----------|
| `interior-studio/products/` | Product images (jpg,png,webp,gif) | 20MB each |
| `interior-studio/projects/` | Project images, MP4 videos, GIFs | 100MB each |
| `interior-studio/services/` | Service images | 10MB |
| `interior-studio/blog/` | Blog cover images | 10MB |
| `interior-studio/categories/` | Category images | 10MB |
| `interior-studio/users/` | User avatars | 5MB |
| `interior-studio/reviews/` | Review photos (up to 3) | 10MB each |
| `interior-studio/settings/` | Logo, hero bg, team photos, OG image | 10MB |

Auto image optimisation: `quality: auto`, `fetch_format: auto` (WebP served to supporting browsers).

---

## 🔐 Login Credentials

| Role | URL | Email | Password |
|------|-----|-------|----------|
| Admin | `/admin` | `admin@luxe.in` | `Admin@1234` |
| User | `/register` | register new | — |

---

## 🗺 Admin Panel

| Page | URL | Cloudinary |
|------|-----|-----------|
| Dashboard | `/admin/dashboard` | — |
| **Products** | `/admin/products` | ✅ Multi-image upload → `/products/` |
| Categories | `/admin/categories` | ✅ Image upload → `/categories/` |
| Orders | `/admin/orders` | — |
| **Projects** | `/admin/projects` | ✅ Images + Videos/GIFs → `/projects/` |
| **Services** | `/admin/services` | ✅ Image upload → `/services/` |
| **Blog** | `/admin/blog` | ✅ Cover image → `/blog/` |
| Customers | `/admin/users` | — |
| Consultations | `/admin/consultations` | — |
| Reviews | `/admin/reviews` | ✅ (uploaded on frontend) |
| **Site Settings** | `/admin/settings` | ✅ Logo, hero, team, OG → `/settings/` |

### Upload DELETE
When you remove an image in any admin form, it is also deleted from Cloudinary automatically.

---

## 📸 All Upload Points

### Admin Panel
- **Products**: multiple images (jpg/png/webp/gif), stored in `/products/`
- **Projects**: multiple images + MP4/WebM/GIF videos + YouTube/Vimeo URL embeds
- **Services**: single cover image per service
- **Blog Posts**: cover image per post
- **Categories**: single image per category
- **Site Settings** (8 tabs):
  - Logo image upload
  - Hero background image
  - About page hero image
  - Team member photos (per member)
  - OG/SEO image

### Frontend (public)
- **User Avatar**: uploadable from Profile page → stored in `/users/`
- **Review Photos**: up to 3 photos per review → stored in `/reviews/`

### API Endpoints
```
POST /api/upload/image          → /general/    (generic fallback)
POST /api/upload/video          → /general/
POST /api/upload/multiple       → /general/
POST /api/upload/products       → /products/   (multiple)
POST /api/upload/projects       → /projects/   (multiple, up to 20)
POST /api/upload/services       → /services/   (single)
POST /api/upload/blog           → /blog/       (multiple)
POST /api/upload/categories     → /categories/ (single)
POST /api/upload/avatar         → /users/      (single, auth required)
POST /api/upload/reviews        → /reviews/    (multiple, up to 3)
POST /api/upload/settings       → /settings/   (single)
DELETE /api/upload/delete       → deletes by URL (admin only)
```

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router 6, Framer Motion |
| State | Context API: Auth + Cart + Settings |
| Styling | Pure CSS + CSS Variables, fully responsive |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (30d) |
| **Image Storage** | **Cloudinary** (all uploads) |
| Upload Middleware | multer + multer-storage-cloudinary |
| Notifications | React Hot Toast |

