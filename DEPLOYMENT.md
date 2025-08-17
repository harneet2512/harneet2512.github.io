# 🚀 GitHub Pages Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Repository name: `harneet2512.github.io`
- [ ] Repository is public
- [ ] Main branch is set to `main` or `master`

### 2. GitHub Pages Settings
- [ ] Go to repository Settings → Pages
- [ ] Source: Deploy from a branch
- [ ] Branch: `gh-pages` (will be created automatically)
- [ ] Folder: `/ (root)`
- [ ] Custom domain: `harneet2512.github.io`

### 3. GitHub Actions Setup
- [ ] Go to repository Settings → Actions → General
- [ ] Allow all actions and reusable workflows
- [ ] Ensure `GITHUB_TOKEN` has proper permissions

## 🚀 Deployment Steps

### Step 1: Push Your Code
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### Step 2: Monitor GitHub Actions
- Go to Actions tab in your repository
- Watch the "Deploy to GitHub Pages" workflow
- Wait for it to complete successfully

### Step 3: Verify Deployment
- Check the Actions tab for successful deployment
- Visit `https://harneet2512.github.io`
- Verify your portfolio is working correctly

## 🔧 Manual Deployment (If Needed)

### Option 1: Using GitHub CLI
```bash
# Install GitHub CLI
npm install -g gh

# Login to GitHub
gh auth login

# Deploy manually
npm run build:gh-pages
gh pages deploy dist --branch gh-pages
```

### Option 2: Using gh-pages package
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check GitHub Actions logs
   - Ensure all dependencies are in package.json
   - Verify Vite configuration

2. **Page Not Loading**
   - Check if gh-pages branch was created
   - Verify GitHub Pages settings
   - Wait 5-10 minutes for changes to propagate

3. **Assets Not Loading**
   - Check base path in vite.config.ts
   - Ensure CNAME file is in public folder
   - Verify build output structure

### Debug Commands:
```bash
# Check build output
npm run build:gh-pages
ls -la dist/

# Test locally
npm run preview

# Check for errors
npm run lint
```

## 🔒 Security Features

- ✅ **GitHub Actions**: Automated, secure deployment
- ✅ **Environment Isolation**: Builds in clean environment
- ✅ **Token Security**: Uses GITHUB_TOKEN with minimal permissions
- ✅ **HTTPS Only**: GitHub Pages enforces HTTPS
- ✅ **No Sensitive Data**: Build process doesn't expose secrets

## 📱 Post-Deployment

1. **Test Responsiveness**: Check on different devices
2. **Performance**: Use Lighthouse to audit performance
3. **SEO**: Verify meta tags and structured data
4. **Analytics**: Set up Google Analytics if needed
5. **Monitoring**: Set up uptime monitoring

## 🎯 Success Indicators

- ✅ GitHub Actions workflow completes successfully
- ✅ gh-pages branch is created automatically
- ✅ Portfolio loads at `https://harneet2512.github.io`
- ✅ All assets (CSS, JS, images) load correctly
- ✅ Responsive design works on mobile/desktop
- ✅ Preloader and animations function properly

---

**Need Help?** Check the GitHub Actions logs or create an issue in the repository.
