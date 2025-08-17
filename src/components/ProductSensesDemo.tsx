import { useState } from "react";
import { ProductSensesVisualizer } from "./ProductSensesVisualizer";

export function ProductSensesDemo() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <div className="w-full h-screen bg-black flex flex-col">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white font-mono text-sm hover:bg-white/20 transition-colors"
        >
          {theme === "dark" ? "🌙" : "☀️"} {theme.toUpperCase()} MODE
        </button>
      </div>

      {/* Component */}
      <div className="w-full h-full">
        <ProductSensesVisualizer theme={theme} />
      </div>
    </div>
  );
} 