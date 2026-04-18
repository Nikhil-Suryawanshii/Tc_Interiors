# Luxe Interior Studio — Complete MERN Stack Website

## 🚀 Quick Start

```bash
# 1. Backend
cd server
cp .env.example .env      # set MONGO_URI + JWT_SECRET
npm install
npm run seed              # creates admin@luxe.in / Admin@1234
npm run dev               # → http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm start                 # → http://localhost:3000
```

---

## 🔐 Login Credentials

| Role  | URL | Email | Password |
|-------|-----|-------|----------|
| Admin | `/admin` | `admin@luxe.in` | `Admin@1234` |
| User  | `/login` | register at `/register` | — |

---

## 🗺 Admin Panel URLs

| Page | URL |
|------|-----|
| Admin Login | `/admin` |
| Dashboard | `/admin/dashboard` |
| **Site Settings** | `/admin/settings` |
| Products | `/admin/products` |
| Categories | `/admin/categories` |
| **Services** | `/admin/services` |
| Orders | `/admin/orders` |
| Projects | `/admin/projects` |
| Blog | `/admin/blog` |
| Customers | `/admin/users` |
| Consultations | `/admin/consultations` |
| Reviews | `/admin/reviews` |

---

## ⚙️ Site Settings (Admin → Settings)

All managed from Admin → Site Settings:

| Tab | Controls |
|-----|----------|
| 🏷️ Logo & Branding | Upload logo image OR set text logo, sub-text, tagline |
| 🎨 Theme & Colors | Primary/dark/light/accent color pickers + font names |
| 📍 Contact Info | Address, 2 phones, 2 emails, hours, WhatsApp, Google Maps embed |
| 🔗 Social Media | Instagram, Facebook, LinkedIn, YouTube, Twitter, Pinterest |
| 📄 Footer | About text, copyright line, newsletter toggle |
| 🖼️ Hero Section | Title, description, background image, CTA buttons |
| 👥 About Page | Hero image, intro, mission, stats (repeatable), team (repeatable + photo upload) |
| 🔍 SEO | Meta title, description, keywords, OG image |

**All changes apply immediately to the live site.**

---

## 🛠 Services CRUD (Admin → Services)

- Add/edit/delete services with name, icon, short & full description
- Upload service image
- Add features (one per line)
- Add process steps (step number + title + description)
- Add pricing tiers (label + price + description)
- Set sort order & homepage visibility

---

## 📋 Contact Page

Contact page automatically displays:
- Address, phone, email, hours — from Settings → Contact Info
- WhatsApp chat button — if WhatsApp number is set
- Google Maps iframe — if map URL is set
- Consultation booking form — saves to DB, visible in Admin → Consultations

---

## 🖼️ Dynamic Navbar & Footer

Both Navbar and Footer pull all content from Settings:
- Logo (image or text)
- Contact info in footer
- Social media icons in footer
- Copyright text

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router 6, Framer Motion |
| State | Context API: Auth + Cart + **Settings** |
| Styling | Pure CSS + CSS Variables |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (30d) |
| Uploads | Multer — images, videos, GIFs (100MB) |
| Notifications | React Hot Toast |

---

## 🗄️ Models

User, Product, Category, Project, Service, Blog, Order, Review, Consultation, **Settings**

## 📡 API Routes

```
/api/auth         — register, login, me
/api/products     — CRUD + search/filter/sort/paginate
/api/categories   — CRUD
/api/services     — CRUD
/api/projects     — CRUD + video/GIF support
/api/blog         — CRUD + publish
/api/orders       — create, my orders, admin all, status update
/api/reviews      — create, approve, delete
/api/consultations — create, admin list+update
/api/upload       — image, video, multiple (multer)
/api/admin        — stats, users list, role toggle
/api/settings     — GET all, GET by key, PUT by key (admin)
```
