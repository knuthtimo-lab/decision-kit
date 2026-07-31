# 🚀 GitHub & npm Deployment Guide for `decision-kit`

Follow these step-by-step instructions to upload `decision-kit` to **GitHub (DR 97)** and **npm (DR 94)** to maximize high-authority backlinks for **`entscheidomat.com`**.

---

## Part 1: Upload to GitHub (DR 97 Backlink)

### Step 1: Initialize Git in the `decision-kit` folder

Open PowerShell or terminal in the `decision-kit` directory:

```bash
cd c:\Users\timo\Documents\Elena\webseite\decision-kit
git init
git add .
git commit -m "feat: initial release of decision-kit v1.0.0"
```

### Step 2: Create a New GitHub Repository

1. Go to [GitHub - New Repository](https://github.com/new).
2. Set **Repository name**: `decision-kit`
3. Set **Description**: `The ultimate zero-dependency TypeScript & React library for decision-making algorithms, spinner wheels, weighted sampling, and dice notation.`
4. Set visibility to **Public**.
5. Click **Create repository**.

### Step 3: Link and Push to GitHub

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/decision-kit.git
git branch -M main
git push -u origin main
```

### Step 4: Configure GitHub Repository Metadata (Crucial for DR 97 Link!)

1. On your GitHub repository page (`https://github.com/YOUR_GITHUB_USERNAME/decision-kit`):
2. Click the ⚙️ **About** gear icon on the top right.
3. In the **Website** field, enter:
   `https://entscheidomat.com`
4. Add Topics:
   `decision-maker`, `random-picker`, `wheel-of-fortune`, `spinner-wheel`, `weighted-random`, `dice-roller`, `react-hooks`, `typescript`, `entscheidomat`
5. Save changes.

---

## Part 2: Publish to npm Registry (DR 94 Backlink)

Publishing to npm generates an additional **DR 94** backlink from `npmjs.com/package/decision-kit` directly to `entscheidomat.com`.

### Step 1: Test Build & Package locally

```bash
npm run build
```

### Step 2: Login to npm

```bash
npm login
```

### Step 3: Publish Package

```bash
npm publish --access public
```

---

## Part 3: Backlink Check & Verification

Once published, verify that your backlinks are active:

1. **GitHub Main Repo**:
   - `https://github.com/YOUR_GITHUB_USERNAME/decision-kit`
   - Check the **About** section on the right side links to `https://entscheidomat.com`.
   - Check the README badges and live demo table link to `https://entscheidomat.com` and its tool landing pages (`/gluecksrad`, `/ja-nein-generator`, etc.).

2. **npm Registry**:
   - `https://www.npmjs.com/package/decision-kit`
   - Check Homepage link in the sidebar leads to `https://entscheidomat.com`.
   - Check README rendered on npm contains all active links.

---

## 🎯 Summary of Backlinks Created

| Platform | Domain Authority (DR) | Target URL | Link Type |
| :--- | :--- | :--- | :--- |
| **GitHub Repository About** | **DR 97** | `https://entscheidomat.com` | Direct DoFollow |
| **GitHub README Header** | **DR 97** | `https://entscheidomat.com` | Shield Badge Link |
| **GitHub README Demos** | **DR 97** | `https://entscheidomat.com/gluecksrad` etc. | Markdown Table Links |
| **npm Registry Sidebar** | **DR 94** | `https://entscheidomat.com` | Homepage Citation |
| **npm Registry README** | **DR 94** | `https://entscheidomat.com/*` | Rendered HTML Links |
