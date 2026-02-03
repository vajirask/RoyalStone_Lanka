import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Home as HomeIcon, ShoppingBag, BookOpen, Sparkles, User, ChevronRight, Target, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [activeHash, setActiveHash] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Determine which section is in view for hash links
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        // If the section is in the top portion of the screen
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActiveHash("#about");
        } else if (window.scrollY < 100) {
          setActiveHash("");
        }
      }
    };
    const checkUser = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", checkUser);
    handleScroll(); // Initial check
    checkUser();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Vision & Mission", href: "/#about", icon: Target, isHash: true },
    { name: "Shop", href: "/marketplace", icon: ShoppingBag },
    { name: "Gem Guide", href: "/education", icon: BookOpen },
    { name: "AI Recognition", href: "/ai-recognition", icon: Sparkles },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 border-b",
        isScrolled
          ? "h-16 bg-background/90 backdrop-blur-xl border-border shadow-md"
          : "h-20 bg-background/60 backdrop-blur-md border-transparent shadow-none"
      )}
    >
      <div className="container mx-auto h-full px-4 lg:px-8">
        <div className="flex h-full items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 transition-all duration-500 transform group-hover:scale-110">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-primary-light blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative h-full w-full overflow-hidden rounded-full shadow-lg ring-1 ring-white/20 transition-all duration-500">
                <img src={logo} alt="Royalstone Lanka Logo" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text text-transparent group-hover:animate-shimmer transition-all duration-500">
                Royalstone Lanka
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5 opacity-80 group-hover:text-primary transition-colors">
                Authentic Sri Lankan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-2">
            {navigation.map((item) => {
              const isActive = item.isHash
                ? activeHash === "#about" && location.pathname === "/"
                : location.pathname === item.href && activeHash === "";

              const handleClick = (e: React.MouseEvent) => {
                if (item.isHash && location.pathname === "/") {
                  e.preventDefault();
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                }
              };

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={handleClick}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 group/nav relative overflow-hidden",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isActive ? "scale-110 text-primary" : "group-hover/nav:scale-110 group-hover/nav:text-primary"
                  )} />
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative group h-10 w-10 rounded-full bg-muted/40 hover:bg-primary transition-all duration-500 hover:shadow-lg hover:shadow-primary/30"
              >
                <ShoppingCart className="h-5 w-5 text-foreground group-hover:text-white transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground shadow-xl border-2 border-background animate-bounce">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {user.name} ({user.role || (user.email === 'admin@royalstone.com' ? 'admin' : 'user')})
                </span>
                <Button
                  onClick={handleLogout}
                  variant="premium"
                  className="h-10 rounded-full px-8 font-bold shadow-lg hover:shadow-primary/30 active:scale-95 transition-all text-sm group/btn"
                >
                  <span className="relative z-10">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button variant="premium" className="h-10 rounded-full px-8 font-bold shadow-lg hover:shadow-primary/30 active:scale-95 transition-all text-sm group/btn">
                  <span className="relative z-10">Sign In</span>
                  <Sparkles className="ml-2 h-4 w-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-10 w-10 rounded-xl bg-muted/40 hover:bg-muted transition-all"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l border-primary/10">
                <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/30">
                  <SheetHeader className="p-8 border-b border-border/50 bg-background/50 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden shadow-2xl ring-2 ring-primary/20">
                          <img src={logo} alt="Logo" className="h-full w-full object-cover" />
                        </div>
                        <SheetTitle className="text-left font-black text-2xl tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                          Royalstone
                        </SheetTitle>
                      </div>
                    </div>
                  </SheetHeader>

                  <div className="flex flex-col gap-3 p-6 mt-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-3 mb-2 opacity-60">
                      Discovery
                    </p>
                    {navigation.map((item, index) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "flex items-center justify-between px-5 py-5 rounded-2xl transition-all duration-500 group border border-transparent hover:translate-x-2",
                            isActive
                              ? "bg-primary/10 text-primary border-primary/20 shadow-md translate-x-1"
                              : "hover:bg-muted/50 hover:border-border/50"
                          )}
                          style={{ transitionDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-5">
                            <div className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 shadow-sm",
                              isActive ? "bg-primary text-white scale-110 rotate-3" : "bg-background border border-border group-hover:scale-110"
                            )}>
                              <item.icon className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl">{item.name}</span>
                          </div>
                          <ChevronRight className={cn(
                            "h-5 w-5 transition-all duration-500",
                            isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                          )} />
                        </NavLink>
                      );
                    })}
                  </div>

                  <div className="mt-auto p-8 space-y-4">
                    <Link to="/login" className="block w-full">
                      <Button className="w-full h-15 rounded-2xl text-lg font-black gap-3 shadow-2xl shadow-primary/20 bg-gradient-to-r from-primary to-primary-dark hover:scale-[1.02] active:scale-95 transition-all py-8" variant="default">
                        <User className="h-6 w-6 shrink-0" />
                        Sign In Now
                      </Button>
                    </Link>
                    <div className="flex items-center justify-between px-2 pt-6">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">© 2024 Royalstone Lanka</p>
                      <div className="flex gap-4">
                        <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                        <div className="h-1 w-1 rounded-full bg-primary/60 animate-pulse delay-75" />
                        <div className="h-1 w-1 rounded-full bg-primary/30 animate-pulse delay-150" />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
