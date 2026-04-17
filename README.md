# Luxe Interior Studio — Full MERN Stack Website

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd server
cp .env.example .env        # Edit: add your MONGO_URI
npm install
npm run seed                 # Creates admin user
npm run dev                  # Starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm start                    # Starts on http://localhost:3000
```

---

## 🔐 Login Credentials

### Admin Panel
- **URL:** `http://localhost:3000/admin`
- **Email:** `admin@luxe.in`
- **Password:** `Admin@1234`

> Run `npm run seed` in the server folder first to create the admin user.

### Register as Customer
- Go to `http://localhost:3000/register`
- Fill name, email, password — done!

---

## 🗂 Key URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Main website |
| `http://localhost:3000/admin` | Admin login |
| `http://localhost:3000/admin/dashboard` | Admin dashboard |
| `http://localhost:3000/admin/products` | Manage products |
| `http://localhost:3000/admin/orders` | Manage orders |
| `http://localhost:3000/admin/consultations` | View consultations |
| `http://localhost:3000/admin/blog` | Manage blog |
| `http://localhost:5000` | API server |

---

## 🛠 Environment Variables

### `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/interior-studio
JWT_SECRET=change_this_to_something_very_secret_123
CLIENT_URL=http://localhost:3000
```

### `client/.env` (optional — only needed if not using proxy)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ✅ Bug Fixes in This Version

1. **Register/Login fixed** — AuthContext now shows a loading spinner while checking token, prevents navigation errors
2. **CORS fixed** — server now accepts all origins in development
3. **API proxy fixed** — client uses `/api` relative URL through CRA proxy, no hardcoded localhost
4. **Admin routes fully wired** — `/admin/*` uses separate layout, no navbar/footer
5. **Admin guard** — non-admin users are redirected away from admin routes

---

## 🎛 Admin Panel Features

- **Dashboard** — Revenue, orders, products, users, recent activity
- **Products** — Full CRUD with image upload, categories, pricing, stock
- **Categories** — Create/edit/delete product categories  
- **Orders** — View all orders, update status (Placed→Confirmed→Shipped→Delivered)
- **Projects** — View portfolio, delete entries
- **Blog** — Create/edit/publish blog posts with HTML content
- **Customers** — View all users, toggle admin role
- **Consultations** — View booking requests, update status
- **Reviews** — Approve/delete product reviews

---

## 📦 Tech Stack

| | |
|---|---|
| Frontend | React 18, React Router 6, Framer Motion, React Icons |
| Styling | Pure CSS + CSS Variables |
| State | Context API (Auth + Cart) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (30 day tokens) |
| File Upload | Multer (images, videos, GIFs up to 100MB) |
| Notifications | React Hot Toast |
