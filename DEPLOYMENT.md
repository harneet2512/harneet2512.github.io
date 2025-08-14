# Portfolio Deployment Guide

This guide will help you deploy your new React/TypeScript portfolio to GitHub Pages.

## Prerequisites

- GitHub account with the repository: `harneet2512/harneet2512.github.io`
- Node.js and npm installed locally
- Git configured on your machine

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add new React portfolio"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository: https://github.com/harneet2512/harneet2512.github.io
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "GitHub Actions"
   - The GitHub Actions workflow will automatically build and deploy your site

3. **Wait for deployment:**
   - Go to "Actions" tab to monitor the deployment progress
   - Once complete, your site will be available at: https://harneet2512.github.io

### Option 2: Manual Deployment

1. **Build the project:**
   ```bash
   npm run build:gh-pages
   ```

2. **Deploy to GitHub Pages:**
   - Copy all contents from the `dist` folder
   - Go to your repository: https://github.com/harneet2512/harneet2512.github.io
   - Delete all existing files (except .git folder)
   - Upload the new files from the `dist` folder
   - Commit and push the changes

## Important Notes

- The base path is configured as `/harneet2512.github.io/` in `vite.config.ts`
- Make sure all your assets and routes work with this base path
- The site will be available at: https://harneet2512.github.io
- Any future pushes to the main branch will automatically trigger a new deployment

## Troubleshooting

- If you see a 404 error, check that the base path is correct in `vite.config.ts`
- If assets don't load, ensure they're being built to the correct paths
- Check the GitHub Actions logs for any build errors

## Local Development

To test locally with the same base path:
```bash
npm run dev
```

Your portfolio should now be accessible at the local development server.
