# 🏁 Ruan's Dealership Hub

A modern **React Single Page Application (SPA)** for managing vehicle dealership inventory. The application features a responsive public catalog, a secure admin dashboard, full CRUD functionality, Firebase integration, and real-time data synchronization.

This project was built to demonstrate modern React development practices, client-side routing, state management, authentication, and cloud database integration.

---

## 🚀 Features

### 🚗 Public Vehicle Catalog

- Browse available vehicle listings stored in Firebase Firestore.
- Filter inventory by **All**, **New**, or **Used** vehicles without reloading the page.
- View larger vehicle images using an interactive image modal.
- Submit inquiries directly from each vehicle listing using an integrated contact form.

### 🔒 Secure Admin Dashboard

- Protected admin login using Firebase Authentication.
- Add, edit, and delete vehicle listings.
- Update vehicle availability status:
  - Available
  - Pending
  - Sold
- View customer inquiries in real time.
- Record login attempts using audit logs for successful and failed authentication events.

---

## 🛠️ Tech Stack

### Frontend

- React 19
- React Hooks
- React Router
- JavaScript (ES Modules)

### Backend & Database

- Firebase 12
- Cloud Firestore
- Firebase Authentication
- Firebase Storage

### Development Tools

- Vite 8
- npm

### Styling

- Responsive CSS
- GitHub-inspired Dark Theme

---

## 🗄️ Database Structure

The project uses three Firestore collections:

### `cars`

Stores vehicle inventory including:

- Make
- Model
- Price (ZAR)
- Power Output
- Condition
- Status
- Images

### `inquiries`

Stores customer inquiries including:

- Customer details
- Vehicle ID
- Vehicle information
- Message

### `login_logs`

Stores authentication history including:

- Email
- Login timestamp
- Login status
- Success or failure

---

# 📦 Installation

## Prerequisites

Make sure you have the following installed:

- Node.js (v18 or later)
- npm

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/car-dealership-hub.git

cd car-dealership-hub
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Firebase

Create either:

```
src/config/firebase.js
```

or use a `.env` file containing your Firebase configuration.

Example:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

---

## 4. Start the Development Server

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:5173
```

---

# 🔑 Demo Credentials

Use the following credentials to access the admin dashboard.

**Email**

```
admin@dealership.co.za
```

**Password**

```
password123
```

---

# 📁 Project Structure

```text
src/
├── components/
│   ├── CarCard.jsx
│   └── Navbar.jsx
│
├── config/
│   └── firebase.js
│
├── pages/
│   ├── AdminDashboard.jsx
│   ├── Catalog.jsx
│   └── Login.jsx
│
├── App.jsx
└── main.jsx
```

---

# 📚 What I Learned

Building this project helped strengthen my understanding of:

- React Functional Components
- React Hooks
- React Router
- Firebase Authentication
- Cloud Firestore
- CRUD Operations
- Component-based architecture
- State management
- Responsive UI design
- Real-time database synchronization

---

# 🚀 Future Improvements

Some features planned for future versions include:

- Vehicle search functionality
- Sorting by price and manufacturer
- Pagination
- Multiple dealership branches
- User account management
- Vehicle image uploads
- Dashboard analytics
- Dark / Light mode toggle

---

# 📸 Screenshots

> Add screenshots of your application here.

Example:

- Home Page
- Vehicle Details
- Admin Dashboard
- Mobile Layout

---

# 🌐 Live Demo

Coming Soon

*(Replace this section with your Vercel or Netlify deployment once the project is online.)*

---

# 👨‍💻 Author

**Ruan**

GitHub:
https://github.com/YOUR_GITHUB_USERNAME

---

# 📄 License

This project is licensed under the MIT License.