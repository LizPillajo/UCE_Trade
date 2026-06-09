

# 🚀 UCE Trade Frontend

**Modern Marketplace for UCE Students and Community**

---

## 📝 Overview

UCE Trade is a web platform designed for the Universidad Central del Ecuador (UCE) community, enabling students to showcase, sell, and manage their entrepreneurial ventures. The frontend is built with React, Vite, and Material UI, providing a fast, modern, and responsive user experience.

---

## ✨ Features

- 🛒 **Public Marketplace:** Browse, search, and filter ventures by category, price, and popularity.
- 🔐 **Authentication:** Secure login and registration with email/password and Google OAuth.
- 🎓 **Student Dashboard:** Personalized dashboard for students to manage their ventures, view sales, and performance KPIs.
- 🛠️ **Admin Panel:** Admins can manage users, ventures, and access advanced analytics and reports.
- 🔔 **Real-Time Notifications:** WebSocket integration for instant updates on sales and system events.
- 💳 **Payments:** Stripe integration for secure online payments and invoice downloads.
- 👤 **Profile Management:** Edit user profiles, including faculty selection and bio.
- 📱 **Responsive Design:** Fully responsive UI for desktop and mobile devices.

---

## 🛠️ Tech Stack

- ⚛️ **Frontend:** React 19, Vite, Material UI (MUI)
- 🧠 **State Management:** Zustand
- 🔄 **Data Fetching:** React Query
- 📝 **Forms & Validation:** React Hook Form, Zod
- 🔑 **Authentication:** Firebase, Google OAuth, JWT
- 💸 **Payments:** Stripe
- 🔴 **Real-Time:** WebSocket (STOMP over SockJS)
- 🖥️ **Backend API:** Java Spring Boot (see backend repo)
- ☁️ **Other:** Supabase (file storage), ESLint, Prettier

---

## 📁 Project Structure

```
uce-trade-frontend/
├── src/
│   ├── components/      # 🧩 Reusable UI components
│   ├── pages/           # 📄 Page-level components (public, auth, student, admin)
│   ├── services/        # 🔗 API, auth, and utility services
│   ├── hooks/           # 🪝 Custom React hooks
│   ├── data/            # 📚 Static data (faculties, etc.)
│   ├── theme/           # 🎨 MUI theme configuration
│   ├── routes/          # 🗺️ App routing
│   ├── store/           # 🗄️ Zustand stores
│   └── main.jsx         # 🚪 App entry point
├── public/
├── Dockerfile
├── nginx.conf
├── package.json
└── vite.config.js
```

---

## 🚦 Getting Started

### 📋 Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### ⚙️ Installation

1. **Clone the repository:**
	```bash
	git clone <repo-url>
	cd uce-trade-frontend
	```

2. **Install dependencies:**
	```bash
	npm install
	```

3. **Environment Variables:**
	- Create a `.env` file in the root directory with the following variables:
	  ```env
	  VITE_API_URL=http://<backend-url>/api
	  VITE_FIREBASE_API_KEY=...
	  VITE_FIREBASE_AUTH_DOMAIN=...
	  VITE_FIREBASE_PROJECT_ID=...
	  VITE_FIREBASE_STORAGE_BUCKET=...
	  VITE_FIREBASE_MESSAGING_SENDER_ID=...
	  VITE_FIREBASE_APP_ID=...
	  VITE_SUPABASE_URL=...
	  VITE_SUPABASE_ANON_KEY=...
	  VITE_STRIPE_PUBLIC_KEY=...
	  ```

---

## 🏃‍♂️ Running the App

### 💻 Development

```bash
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### 🏗️ Production Build

```bash
npm run build
npm run preview
```

---

## 🐳 Docker Deployment

The project includes a multi-stage Dockerfile for production deployment with Nginx.

**Build and Run with Docker:**

```bash
docker build -t uce-trade-frontend .
docker run -p 80:80 uce-trade-frontend
```

---

## 🌐 Nginx Configuration

The `nginx.conf` file is set up for SPA routing and static file serving. It ensures all routes are handled by `index.html`.

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

For questions or support, please contact the project maintainer.
