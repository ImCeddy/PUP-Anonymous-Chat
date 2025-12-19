
# PUP Anonymous Chat Website

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development servers
npm run dev                    # Frontend on http://localhost:5174
cd backend && npm start        # Backend on http://localhost:3001
```

## 🌐 Deployment for Students (Free Options)

### Option 1: Railway + GitHub Pages (Recommended)

1. **Backend**: Deploy to [Railway](https://railway.app) (Free tier)
2. **Frontend**: Deploy to GitHub Pages (Free)

```bash
# 1. Deploy backend to Railway
# Follow the guide in DEPLOYMENT_GUIDE.md

# 2. Update frontend with Railway URL
./setup-deployment.sh https://your-app.up.railway.app

# 3. Push to GitHub - auto-deploys to Pages
git add .
git commit -m "Deploy to production"
git push origin main
```

### Option 2: Vercel (All-in-One)

1. Import your repo to [Vercel](https://vercel.com)
2. Vercel auto-detects full-stack setup
3. Add environment variables in Vercel dashboard

## 📚 Features

- Real-time anonymous chat
- User pairing system
- Content moderation
- Connection status indicators
- Mobile responsive design
- Auto-reconnection
- Rate limiting and security

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Socket.io + Express
- **Deployment**: GitHub Pages + Railway/Vercel

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Environment Setup](./backend/.env.example)  
