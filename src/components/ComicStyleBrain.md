# ComicStyleBrain Component

A minimalist, 2.5D comic-style brain component inspired by Spider-Verse aesthetics with product management spider-senses.

## Features

### 🧠 Brain Design
- **Pure white brain** with soft gray outlines (#666666)
- **Custom SVG shape** - no external models or photorealistic assets
- **Comic-style illustration** with smooth curvature and clean lines
- **Breathing animation** via framer-motion (4-second cycle, scale 1.0-1.05)

### 🕷️ Spider-Sense Lines
- **6 animated signal lines** with jagged, comic-style paths
- **Monospaced labels** in JetBrains Mono/DM Mono font
- **Hover interactions** with pulse effects and color changes
- **Staggered animations** on load with smooth fade-ins

### 🎨 Visual Elements
- **Pure black background** (#000000)
- **Off-white text** (#EAEAEA) for labels
- **Subtle glow effect** around the brain
- **Spider-Verse motion language** with jitter and pulsations

## Spider-Sense Labels

1. **USER PAIN** (-60°)
2. **BUILD × IMPACT SENSE** (-36°)
3. **NARRATIVE FIT** (-12°)
4. **TIMING INSTINCT** (12°)
5. **TRADEOFF RADAR** (36°)
6. **SIGNAL DETECTION** (60°)

## Usage

### Basic Usage
```tsx
import { ComicStyleBrain } from "./ComicStyleBrain";

function MyComponent() {
  return (
    <div className="w-full h-screen bg-black">
      <ComicStyleBrain />
    </div>
  );
}
```

### In Hero Section
```tsx
import { ComicStyleBrain } from "./ComicStyleBrain";

export function Hero() {
  return (
    <section className="min-h-[55vh] flex flex-col md:flex-row bg-black">
      {/* Left side - content */}
      <div className="w-full md:w-[60%]">
        {/* Your content */}
      </div>
      
      {/* Right side - brain */}
      <div className="w-full md:w-[40%]">
        <ComicStyleBrain />
      </div>
    </section>
  );
}
```

## Dependencies

- `framer-motion@12.23.6` - For breathing and label animations
- `react@18.3.1` - React framework
- `tailwindcss` - For styling

## Animation Details

### Brain Breathing
- **Duration**: 4 seconds per cycle
- **Scale**: 1.0 → 1.05 → 1.0
- **Easing**: easeInOut
- **Repeat**: Infinite

### Label Animations
- **Staggered entrance**: 0.2s delay between each label
- **Duration**: 0.6s fade-in with scale
- **Easing**: easeOut

### Line Animations
- **Staggered entrance**: 0.5s + (index * 0.1s) delay
- **Duration**: 0.8s scale-in
- **Easing**: easeOut

## Customization

The component is designed to be self-contained but can be customized by modifying:

- **Brain SVG path** in the component
- **Spider-sense labels** in the `SPIDER_SENSE_LINES` array
- **Animation timing** in the variants
- **Colors** in the CSS classes and SVG attributes

## Demo Routes

- `/brain-demo` - Full-screen brain component demo
- `/hero-with-brain` - Hero section with brain integration 