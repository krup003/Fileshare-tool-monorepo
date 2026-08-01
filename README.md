# 📁 FileShareLive

A modern file-sharing platform that allows users to securely upload files, generate unique shareable links, and let recipients download files without creating an account.

Whether you want to share files publicly or securely with password protection, FileShareLive provides a simple and reliable solution.

---

## ✨ Features

- 📤 Upload File in any formate
- 🔗 Generate a unique shareable URL
- 🌍 Public file sharing
- 🔒 Private file sharing with a 6-digit OTP
- 📥 Download files using the generated URL
- ☁️ Cloudinary-powered file storage
- 📊 File metadata stored in MongoDB
- ⚡ Fast and responsive UI
- 📱 Mobile-friendly interface

---

## 🔐 Sharing Types

### 🌍 Public Share

- Upload files
- Generate a unique URL
- Anyone with the link can access and download the files

Example:

```
https://your-domain.com/share/abc123xyz
```

---

### 🔒 Private Share

- Upload files
- Generate a unique URL
- A secure 6-digit OTP is generated
- The recipient must enter the OTP before downloading the files

Example:

```
URL:
https://your-domain.com/share/abc123xyz

Password:
483921
```

---

## 🏗️ Project Architecture

```
Frontend (Next.js)
        │
        │
        ▼
Cloudinary Upload Widget
        │
        ▼
Cloudinary Storage

        │
        ▼
Backend (Node.js + Express)
        │
        ▼
MongoDB
```

### Why upload directly to Cloudinary?

Vercel Serverless Functions have bandwidth and execution limits.

To avoid transferring large files through the backend:

- Files are uploaded directly from the frontend to Cloudinary.
- The backend only stores metadata such as:
  - File information
  - Public/Private status
  - Generated URL
  - OTP (for private shares)
  - Expiration details (if enabled)

This approach significantly reduces backend bandwidth usage and improves upload performance.

---

# 🛠 Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- REST APIs

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Storage

- Cloudinary

## Deployment

- Vercel (Frontend)
- Vercel (Backend)

---

# 📂 Monorepo Structure

```
Fileshare-tool-monorepo
│
├── frontend
│   ├── app
│   ├── components
│   ├── lib
│   └── ...
│
├── backend
│   ├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   └── ...
│
└── README.md
```
