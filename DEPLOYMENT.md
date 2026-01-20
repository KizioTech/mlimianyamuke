# Deployment Checklist

## Pre-Deployment
- [ ] All environment variables set
- [ ] OpenWeatherMap API key obtained
- [ ] Images compressed and optimized
- [ ] All broken links fixed
- [ ] Contact form endpoint configured
- [ ] WhatsApp number updated
- [ ] Real testimonials added (or placeholder notice)
- [ ] Analytics configured
- [ ] Error tracking setup (optional)

## Build Process
```bash
# 1. Install dependencies
npm install

# 2. Create production build
npm run build

# 3. Test production build locally
npm run preview

# 4. Check build size
du -sh dist/
```

## Deployment Options

### Option A: Vercel (Recommended - Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Option B: Netlify (Alternative - Free)
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

### Option C: Traditional Hosting
- Build: `npm run build`
- Upload `dist/` folder to hosting
- Configure Apache/Nginx to serve SPA
- Set up SSL certificate

## Post-Deployment
- [ ] Test all functionality on live site
- [ ] Check mobile responsiveness
- [ ] Verify API calls work
- [ ] Test forms submit correctly
- [ ] Verify analytics tracking
- [ ] Check page load speeds
- [ ] Test on different devices
- [ ] Set up monitoring (UptimeRobot, etc.)