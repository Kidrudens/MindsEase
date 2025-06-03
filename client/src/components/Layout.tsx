import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-9 w-9 text-primary" />
              <h1 className="ml-2 text-2xl font-medium text-neutral-800">MindEase</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/" 
                className={cn(
                  "font-medium transition-colors",
                  isActive("/")
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-neutral-700 hover:text-primary"
                )}
              >
                Dashboard
              </Link>
              <Link 
                to="/daily-log" 
                className={cn(
                  "font-medium transition-colors",
                  isActive("/daily-log") || location.startsWith("/daily-log/")
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-neutral-700 hover:text-primary"
                )}
              >
                Daily Log
              </Link>
              <Link 
                to="/history" 
                className={cn(
                  "font-medium transition-colors",
                  isActive("/history")
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-neutral-700 hover:text-primary"
                )}
              >
                History
              </Link>
              <Link 
                to="#" 
                className="font-medium text-neutral-700 hover:text-primary transition-colors"
              >
                Resources
              </Link>
            </nav>
            <button className="md:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden md:flex items-center">
              <button className="flex items-center font-medium text-neutral-800 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Account</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-12">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-6 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-primary" />
              <span className="ml-2 text-sm font-medium text-neutral-700">MindEase © {new Date().getFullYear()}</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-neutral-600 hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-sm text-neutral-600 hover:text-primary">Terms of Service</a>
              <a href="#" className="text-sm text-neutral-600 hover:text-primary">Contact</a>
              <a href="#" className="text-sm text-neutral-600 hover:text-primary">Help</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}