## 📞 Phonebook Application

## A high-performance full-stack contact manager. Built with React 19 for a snappy UI and a Node.js backend powered by MongoDB Atlas for secure data persistence.

## 🚀 Key Features

- 📱 Full CRUD: Seamlessly add, view, update, and delete contacts.
- 🌍 I18n Ready: Full multi-language support (English/Arabic/etc.) via i18next.
- 🛡️ Smart Validation:
- Names: Minimum 3 characters required.
  - Numbers: Strict patterns (XX-XXXXXX or XXX-XXXXXXX) with min. 8 digits.
- ⚡ Modern Stack: Vite-powered frontend for instant performance.
- 📊 Status Tracking: Dedicated /info page for real-time server and contact statistics.
- 🔍 Request Logging: Detailed HTTP logging via Morgan.

---

## 🛠️ Technical Stack

## Frontend (Client)

- Framework: React 19
- Build Tool: Vite
- Networking: Axios
- Localization: i18next & react-i18next
- Security: JWT & Bcryptjs logic ready

## Backend (Server)

- Runtime: Node.js
- Framework: Express.js (v5.1.0)
- Database: MongoDB Atlas
- ODM: Mongoose (v8.16.2)
- Tooling: Dotenv, Morgan, Cors

---

## 📁 Project Structure

```text
fullstack-phonebook/
├── backend/                # Express Server Logic
│   ├── dist/               # Built React frontend files (Static)
│   ├── models/             # Mongoose Person schema & validation
│   ├── requests/           # .rest files for API testing
│   ├── index.js            # Express server entry point
│   ├── mongo.js            # Database utility script
│   ├── .env                # Secrets (Local only)
│   └── package.json        
└── frontend/               # React Client Logic
    ├── src/
    │   ├── components/     # UI Components (List, Form, Filter)
    │   ├── services/       # Axios API communication logic
    │   ├── i18n/           # Translation JSONs & config
    │   ├── hooks/          # Custom logic hooks
    │   └── contexts/       # Global state management
    ├── public/             # Static assets & icons
    ├── index.html          # Root template
    ├── vite.config.js      # Build & Proxy configuration
    └── package.json
```


## ⚙️ Quick Start Guide 

## 1. Clone & Install

git clone https://github.com/Eng-Nhshl/fullstack-phonebook.git 

cd fullstack-phonebook

# Setup Backend

cd backend && npm install

# Setup Frontend

cd ../frontend && npm install

## 2. Environment Variables

Create a .env file in the backend/ directory:

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/phonebook 

JWT_SECRET=Your Secret Key 

PORT=3001

## 3. Run Development Servers

You need to run both to develop locally:

- Backend: cd backend && npm run dev (Starts on port 3001)
- Frontend: cd frontend && npm run dev (Starts on port 5173)

---

## 🔌 API Reference

| Method | Endpoint         | Description          | Request Body     |
| ------ | ---------------- | -------------------- | ---------------- |
| GET    | /api/persons     | Fetch all contacts   | N/A              |
| GET    | /api/persons/:id | Get specific contact | N/A              |
| POST   | /api/persons     | Add a new contact    | { name, number } |
| PUT    | /api/persons/:id | Update phone number  | { number }       |
| DELETE | /api/persons/:id | Remove a contact     | N/A              |
| GET    | /info            | HTML page with stats | N/A              |

---

### 📄 LicenseThis

- Feel Free to use the project with your needs

---
