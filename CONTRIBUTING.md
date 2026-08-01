# 🤝 Contributing to FileShareLive

First of all, thank you for considering contributing to **FileShareLive**! 🎉

We welcome contributions from developers of all experience levels. Whether you're fixing a bug, improving documentation, adding a new feature, or enhancing the UI, your contributions are greatly appreciated.

Please read the guidelines below before contributing.

---

# 📋 Contribution Workflow

Every contribution should follow this workflow:

```text
Fork Repository
      │
      ▼
Clone Your Fork
      │
      ▼
Create a Feature Branch
      │
      ▼
Make Your Changes
      │
      ▼
Commit Your Changes
      │
      ▼
Push Your Branch
      │
      ▼
Open a Pull Request
      │
      ▼
Code Review
      │
      ▼
Merge into Main Branch
```

> **Note:** Direct commits or pushes to the `main` branch are not allowed. All contributions must go through a Pull Request for review.

---

# 🚀 Getting Started

## 1. Fork the Repository

Click the **Fork** button on GitHub to create your own copy of the repository.

---

## 2. Clone Your Fork

```bash
git clone https://github.com/<your-github-username>/Fileshare-tool-monorepo.git

cd Fileshare-tool-monorepo
```

---

## 3. Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## 4. Configure Environment Variables

Both the frontend and backend contain a `.env.example` file.

Create a `.env` file in each project and copy the values from the corresponding `.env.example` file.

Example:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Fill in the required environment variables before running the project.

---

## 5. Start the Development Server

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

---

# 🌿 Create a Feature Branch

Always create a new branch before making changes.

Never commit directly to the `main` branch.

```bash
git checkout -b feature/your-feature-name
```

Examples:

```text
feature/file-preview

feature/email-sharing

feature/download-progress

fix/upload-bug

fix/otp-validation

docs/readme-update
```

---

# 💻 Coding Guidelines

## General

- Write clean and readable code.
- Keep commits focused on one feature or fix.
- Follow the existing folder structure.
- Avoid unnecessary dependencies.
- Write meaningful variable and function names.

---

## Frontend Guidelines

- Use TypeScript.
- Use reusable React components.
- Keep components modular.
- Use Tailwind CSS for styling.
- Follow existing project conventions.

---

## Backend Guidelines

- Follow REST API best practices.
- Validate all incoming requests.
- Handle errors properly.
- Keep controllers, services, and models separated.
- Write reusable and maintainable code.

---

# 📝 Commit Message Guidelines

Use meaningful commit messages.

### Good Examples

```text
feat: add drag and drop upload

feat: add file preview support

fix: resolve OTP verification issue

fix: improve upload performance

docs: update README

refactor: simplify upload service
```

### Avoid

```text
update

changes

test

fix

done
```

---

# 🚀 Push Your Branch

After committing your changes, push your branch.

```bash
git push origin feature/your-feature-name
```

---

# 🔀 Open a Pull Request

Open a Pull Request from your feature branch into the `main` branch.

Please include:

- A clear description of your changes.
- Screenshots (if UI changes).
- Related Issue number (if applicable).

Example:

```text
Fixes #25
```

---

# 👀 Pull Request Review

Every Pull Request will be reviewed before merging.

A maintainer may request changes before approval.

Please respond to review comments and update your Pull Request when necessary.

---

# 🐞 Reporting Bugs

Before creating a bug report:

- Search existing Issues.
- Verify the bug hasn't already been reported.

When creating a bug report, include:

- Operating System
- Browser
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

---

# 💡 Suggesting Features

Feature requests are always welcome.

Please include:

- A clear explanation of the problem.
- Why the feature would be useful.
- A possible implementation (optional).

---

# 📂 Project Structure

```
Fileshare-tool-monorepo/
│
├── frontend/
│
├── backend/
│
├── README.md
│
├── CONTRIBUTING.md
│
└── LICENSE
```

---

# ❤️ Ways You Can Contribute

You can contribute by:

- 🐛 Fixing bugs
- ✨ Adding new features
- 📖 Improving documentation
- 🎨 Enhancing the UI/UX
- ⚡ Optimizing performance
- ♻️ Refactoring existing code
- 🧪 Writing tests
- 🔍 Reviewing Pull Requests

Every contribution, big or small, helps improve FileShareLive.

---

# 📜 Code of Conduct

Please be respectful, friendly, and constructive when interacting with the community.

Let's build a welcoming environment where everyone feels comfortable contributing.

---

# 🙏 Thank You

Thank you for taking the time to contribute to **FileShareLive**.

Your support helps make this project better for everyone.

If you find this project useful, don't forget to ⭐ star the repository!