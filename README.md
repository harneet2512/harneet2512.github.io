# Alex Cook - Product Manager Portfolio

A modern, interactive portfolio website showcasing Alex Cook's experience as a Product Manager specializing in AI, systems design, and user experience.

## 🚀 Features

- **Animated Intro**: Full-screen animated introduction with staggered phrases and terminal-style typing
- **Interactive Timeline**: Horizontal timeline showing education and professional experience
- **Project Showcase**: Detailed case studies and impact metrics
- **PM Toolkit**: Interactive tools and methodologies
- **Responsive Design**: Mobile-friendly with modern UI/UX
- **Smooth Animations**: Framer Motion powered transitions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Routing**: React Router DOM

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd alex-cook-product-verse

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎨 Customization

### Intro Phrases
Edit the phrases in `src/components/intro/AnimatedIntro.tsx`:
```tsx
const phrases = [
  "Building with AI",
  "Orchestrating Systems", 
  "Designing with Intent"
];
```

### Timeline Data
Update your experience in `src/components/Timeline.tsx`:
```tsx
const timelineData: TimelineItem[] = [
  // Add your education and experience items
];
```

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

### Custom Domain
Configure your custom domain in your hosting provider's settings.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
