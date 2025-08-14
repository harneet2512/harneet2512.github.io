# Intro Components

This directory contains the animated intro components for Alex Cook's portfolio site.

## Components

### `AnimatedIntro.tsx`
The main animated intro component that displays:
- 3 staggered phrases with fade-in and upward movement
- Typewriter-style terminal prompt
- 5-second auto-transition with fade-out effect
- Full-screen dark background with ambient glow effects

### `IntroWrapper.tsx`
A wrapper component that manages the intro state and integrates with the main page content.

## Features

- **Framer Motion Animations**: Smooth, professional animations
- **Responsive Design**: Mobile-friendly with responsive typography
- **Modern Typography**: Uses monospace fonts for technical aesthetic
- **Ambient Effects**: Subtle glow and gradient effects
- **Auto-transition**: Seamless transition to main content after 5 seconds

## Usage

```tsx
import { IntroWrapper } from "@/components/intro";

// Use in your main page
const Index = () => {
  return <IntroWrapper />;
};
```

## Customization

### Phrases
Edit the `phrases` array in `AnimatedIntro.tsx`:
```tsx
const phrases = [
  "Building with AI",
  "Orchestrating Systems", 
  "Designing with Intent"
];
```

### Terminal Command
Edit the `terminalCommand` in `AnimatedIntro.tsx`:
```tsx
const terminalCommand = "> entering_alexcook.pm";
```

### Timing
Adjust the timing in the `useEffect` hook:
- Phrase transitions: 800ms intervals
- Terminal appearance: 3200ms
- Typewriter speed: 100ms per character
- Total duration: ~5 seconds

## Dependencies

- `framer-motion`: For animations
- `react-router-dom`: For navigation
- `tailwindcss`: For styling 