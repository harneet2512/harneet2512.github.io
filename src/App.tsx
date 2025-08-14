import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { BrainDemo } from "@/components/BrainDemo";
import { HeroWithBrain } from "@/components/HeroWithBrain";
import { ProductSensesDemo } from "@/components/ProductSensesDemo";
import NotionDemo from "./pages/NotionDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/brain-demo" element={<BrainDemo />} />
          <Route path="/hero-with-brain" element={<HeroWithBrain />} />
          <Route path="/product-senses-demo" element={<ProductSensesDemo />} />
          <Route path="/notion-demo" element={<NotionDemo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
