# 🤝 Contributing to FileShareLive

Thank you for considering contributing to **FileShareLive**! 🎉

We welcome contributions of all kinds, including bug fixes, new features, documentation improvements, performance optimizations, and UI enhancements.

---

## 📌 Before You Start

- Search existing Issues before creating a new one.
- If you're planning a major feature, open an Issue first to discuss it.
- Keep pull requests focused on a single feature or fix.
- Follow the project's coding style.

---

## 🚀 Getting Started

### 1. Fork the Repository

Click the **Fork** button at the top-right of this repository.

---

### 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/Fileshare-tool-monorepo.git

cd Fileshare-tool-monorepo
```

---

### 3. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

### 4. Configure Environment Variables

Create a `.env` file in both the `frontend` and `backend` directories using the provided `.env.example` files.

---

### 5. Run the Project

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

---

# 🌿 Create a Branch

Always create a new branch before making changes.

```bash
git checkout -b feature/your-feature-name
```

Examples:

```bash
feature/file-preview
feature/email-sharing
fix/login-bug
docs/readme-update
```

---

# 💻 Coding Guidelines

### Frontend

- Use TypeScript.
- Follow the existing folder structure.
- Use reusable components whenever possible.
- Keep components small and focused.
- Use Tailwind CSS for styling.

### Backend

- Follow REST API conventions.
- Validate request data.
- Write clean and readable code.
- Handle errors properly.
- Keep controllers and services separated.

---

# 📝 Commit Messages

Use meaningful commit messages.

Good examples:

```text
feat: add file preview support

fix: resolve OTP validation issue

docs: update installation guide

refactor: improve upload service
```

Avoid messages like:

```text
update

changes

fixed

test
```

---

# 📤 Submitting a Pull Request

1. Push your branch.

```bash
git push origin feature/your-feature-name
```

2. Open a Pull Request.

3. Provide:

- A clear description of your changes.
- Screenshots (if UI changes).
- Related Issue number (if applicable).

Example:

```text
Fixes #12
```

---

# 🐛 Reporting Bugs

When reporting a bug, include:

- Operating System
- Browser (if applicable)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if available)

---

# ✨ Feature Requests

Before requesting a feature:

- Check if it already exists.
- Explain the problem you're trying to solve.
- Describe your proposed solution.

---

# 📂 Project Structure

```
Fileshare-tool-monorepo
│
├── frontend
│
├── backend
│
├── README.md
│
└── CONTRIBUTING.md
```

---

# ❤️ Ways to Contribute

You can help by:

- Fixing bugs
- Adding new features
- Improving documentation
- Refactoring code
- Improving UI/UX
- Optimizing performance
- Writing tests
- Reviewing Pull Requests

Every contribution, no matter how small, is appreciated.

---

# 📜 Code of Conduct

Please be respectful and constructive when interacting with the community.

Be kind, patient, and welcoming to everyone.

---

# ⭐ Thank You

Thank you for taking the time to contribute to **FileShareLive**!

Your contributions help make this project better for everyone. 🚀