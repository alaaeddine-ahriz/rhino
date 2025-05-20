"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Le Rhino
              </span>
            </Link>
          </div>
          <nav className="hidden sm:flex items-center space-x-8">
            <Link 
              href="/update" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/update") 
                  ? "text-primary after:block after:h-0.5 after:bg-primary" 
                  : "text-muted-foreground"
              }`}
            >
              Documents
            </Link>
            <Link 
              href="/question" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/question") 
                  ? "text-primary after:block after:h-0.5 after:bg-primary" 
                  : "text-muted-foreground"
              }`}
            >
              Questions
            </Link>
            <Link 
              href="/reflection" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/reflection") 
                  ? "text-primary after:block after:h-0.5 after:bg-primary" 
                  : "text-muted-foreground"
              }`}
            >
              Réflexion
            </Link>
          </nav>
          
          {/* Mobile navigation */}
          <div className="sm:hidden flex items-center space-x-5">
            <Link 
              href="/update" 
              className={`text-sm ${isActive("/update") ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              Documents
            </Link>
            <Link 
              href="/question" 
              className={`text-sm ${isActive("/question") ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              Questions
            </Link>
            <Link 
              href="/reflection" 
              className={`text-sm ${isActive("/reflection") ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              Réflexion
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 