import { cn } from "@/lib/utils";
import { Home, BookOpen, User, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/", label: "Home", icon: Home },
  { path: "/library", label: "Library", icon: BookOpen },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-3xl p-4 z-50" 
         style={{ boxShadow: "0 -10px 25px rgba(0,0,0,0.1)" }}>
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const IconComponent = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button 
                className={cn(
                  "flex flex-col items-center space-y-1 p-2 transition-all duration-300",
                  "hover:scale-110 active:scale-95"
                )}
              >
                <IconComponent 
                  className={cn(
                    "text-xl transition-colors",
                    isActive ? "text-kid-blue" : "text-gray-400"
                  )} 
                />
                <span 
                  className={cn(
                    "text-xs font-semibold transition-colors",
                    isActive ? "text-kid-blue" : "text-gray-400"
                  )}
                >
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
