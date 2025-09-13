import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plane, Menu, X, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  const isActive = (path: string) => location === path;

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "U";
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
            <Plane className="text-2xl text-primary" />
            <span className="text-xl font-bold text-foreground">TobuGo</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/chat" 
              className={`transition-colors ${isActive('/chat') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-chat"
            >
              Planificar
            </Link>
            <Link 
              href="/community" 
              className={`transition-colors ${isActive('/community') ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              data-testid="link-community"
            >
              Comunidad
            </Link>
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-trips"
            >
              Mis Viajes
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Authentication Section */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="hidden sm:flex items-center space-x-3">
                <Avatar className="w-8 h-8" data-testid="avatar-user">
                  <AvatarImage src={user.profileImageUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground" data-testid="text-username">
                  {user.firstName || user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                className="hidden sm:block" 
                onClick={handleLogin}
                data-testid="button-login"
              >
                Iniciar Sesión
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/chat" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="link-chat-mobile"
              >
                Planificar
              </Link>
              <Link 
                href="/community" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="link-community-mobile"
              >
                Comunidad
              </Link>
              <Link 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="link-trips-mobile"
              >
                Mis Viajes
              </Link>
              {/* Mobile Authentication Section */}
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : isAuthenticated && user ? (
                <div className="sm:hidden flex flex-col space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8" data-testid="avatar-user-mobile">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground" data-testid="text-username-mobile">
                      {user.firstName || user.email}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-fit" 
                    onClick={handleLogout}
                    data-testid="button-logout-mobile"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Button 
                  className="sm:hidden w-fit" 
                  onClick={handleLogin}
                  data-testid="button-login-mobile"
                >
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
