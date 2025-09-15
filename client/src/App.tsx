import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import Community from "@/pages/community";
import Itinerarios from "@/pages/itinerarios";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navbar";
import { useEffect } from "react";

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground" data-testid="text-loading">Cargando...</p>
      </div>
    </div>
  );
}

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to home (landing) if not authenticated
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Switch>
        {/* Landing page for unauthenticated users */}
        <Route path="/" component={isAuthenticated ? Dashboard : Landing} />
        
        {/* Protected routes */}
        <Route path="/chat" component={() => (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        )} />
        
        <Route path="/chat/:id" component={() => (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        )} />
        
        <Route path="/community" component={() => (
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        )} />
        
        <Route path="/itinerarios" component={() => (
          <ProtectedRoute>
            <Itinerarios />
          </ProtectedRoute>
        )} />
        
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
