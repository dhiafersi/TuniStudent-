# Steps to Push Your Project to GitHub

Follow these steps to publish your TuniStudent project to GitHub:

## Prerequisites
- Git installed on your computer ([Download Git](https://git-scm.com/downloads))
- A GitHub account ([Sign up here](https://github.com/signup))

## Step 1: Initialize Git Repository

Open a terminal in your project root directory (`TuniStudent`) and run:

```bash
git init
```

## Step 2: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `TuniStudent` (or your preferred name)
   - **Description**: "Full-stack app to help Tunisian students discover the best local deals"
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 3: Configure Git (if not already done)

Set your name and email (only needed once per computer):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 4: Stage and Commit Your Files

Add all files to Git (the `.gitignore` will automatically exclude unnecessary files):

```bash
git add .
```

Commit the files:

```bash
git commit -m "Initial commit: TuniStudent project"
```

## Step 5: Connect to GitHub and Push

GitHub will show you commands after creating the repository. Use these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/TuniStudent.git
git push -u origin main
```

**Note**: If you're using SSH instead of HTTPS, the URL will look like:
```bash
git remote add origin git@github.com:YOUR_USERNAME/TuniStudent.git
```

## Step 6: Authenticate (if prompted)

If GitHub prompts for authentication:
- **HTTPS**: You may need to use a Personal Access Token instead of your password
  - Create one at: [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
  - Select scopes: `repo` (full control of private repositories)
- **SSH**: Make sure you have SSH keys set up with GitHub

## Step 7: Verify

Go to your GitHub repository page and verify all files are uploaded correctly.

## Future Updates

After making changes to your project, use these commands to update GitHub:

```bash
git add .
git commit -m "Description of your changes"
git push
```

## Important Notes

⚠️ **Before pushing, make sure you've:**
- ✅ Created `application.properties` from `application.properties.example` and configured it
- ✅ Updated sensitive information (database passwords, JWT secrets)
- ✅ Reviewed the `.gitignore` to ensure no sensitive files are included

The `.gitignore` file will automatically exclude:
- `node_modules/` (frontend dependencies)
- `target/` (compiled Java classes)
- IDE configuration files
- OS-specific files
- Your actual `application.properties` file (if you rename it or use environment variables)

---

**Need help?** Check the [GitHub Documentation](https://docs.github.com/en/get-started) or [Git Documentation](https://git-scm.com/doc).

