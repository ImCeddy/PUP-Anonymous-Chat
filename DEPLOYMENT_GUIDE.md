# 🚀 Free Deployment Guide for Students

## Option 1: Railway + GitHub Pages (Easiest for Students)

### Backend: Railway (Free)
1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repo and deploy the `/backend` folder
4. Add environment variables in Railway dashboard:
   ```
   NODE_ENV=production
   ALLOWED_ORIGINS=https://yourusername.github.io
   ```
5. Get your Railway URL (e.g., `https://your-app.up.railway.app`)

### Frontend: GitHub Pages (Free)
1. In your repo settings → Pages
2. Set source to "GitHub Actions"
3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

4. Update `src/app/App.tsx`:
```typescript
const newSocket = io('https://your-app.up.railway.app', {
  // ... rest of config
});
```

## Option 2: Vercel (All-in-One Free)

### Single Deployment:
1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your GitHub repo
3. Vercel will auto-detect it's a full-stack app
4. Add environment variables:
   ```
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

### File Structure for Vercel:
```
/
├── api/
│   └── socket.js          # Socket.io serverless function
├── src/                   # Your React app
├── package.json
└── vercel.json           # Vercel config
```

## Option 3: Render + GitHub Pages

### Backend: Render (Free)
1. Go to [render.com](https://render.com) and sign up
2. Create "Web Service" from your GitHub repo
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables same as Railway

### Frontend: Same as Option 1

## Testing Your Deployment

1. **Health Check**: Visit `https://your-backend-url/health`
2. **Frontend**: Open your GitHub Pages URL
3. **Chat Test**: Open multiple browser tabs to test pairing

## Cost Comparison (Student-Friendly)

| Service | Free Tier | Limitations | Perfect For |
|---------|-----------|-------------|-------------|
| Railway | 512MB RAM, 1GB disk | Sleeps after 30min inactivity | Small chat apps |
| Render | 750 hours/month | Sleeps after 15min inactivity | Web services |
| Vercel | 100GB bandwidth | 100 serverless functions | Full-stack apps |
| GitHub Pages | Unlimited | Static files only | Frontend hosting |

## Quick Start Commands

```bash
# 1. Test locally first
npm run dev                    # Frontend on :5174
cd backend && npm start        # Backend on :3001

# 2. Deploy backend to Railway
# Follow Railway dashboard steps

# 3. Deploy frontend to GitHub Pages
# Push to main branch, GitHub Actions will deploy automatically
```

## Troubleshooting

- **CORS Issues**: Double-check ALLOWED_ORIGINS matches your frontend URL
- **Connection Errors**: Verify backend URL in frontend code
- **Build Failures**: Check that all dependencies are in package.json

Happy deploying! 🎉