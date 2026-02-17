import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Stock Availability", href: "#stock-checker" },
    { label: "Modules", href: "#modules" },
    { label: "Roles", href: "#roles" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary shadow-md">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className={`font-serif font-bold text-lg leading-none transition-colors ${scrolled ? 'text-foreground' : 'text-white'}`}>
                HIMFED
              </div>
              <div className={`text-[10px] leading-none transition-colors ${scrolled ? 'text-muted-foreground' : 'text-white/70'}`}>
                Smart Control System
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  scrolled
                    ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className={scrolled ? "" : "text-white hover:bg-white/10 hover:text-white"}
              >
                Login
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/30 bg-background/95 backdrop-blur-xl rounded-b-2xl animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Dashboard</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
