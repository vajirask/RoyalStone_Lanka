import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-muted/40 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative h-12 w-12 overflow-hidden rounded-full shadow-lg transition-transform duration-500 group-hover:scale-110">
                <img src={logo} alt="Royalstone Lanka Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">Royalstone Lanka</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Empowering the world with authentic Sri Lankan gemstones through expert education, advanced AI, and a trusted global shop.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Instagram, Twitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border/50 text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:-translate-y-1 shadow-sm"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">Services</h3>
            <ul className="space-y-4 text-sm">
              {[
                { name: "Shop", href: "/marketplace" },
                { name: "Gem Guide", href: "/education" },
                { name: "AI Identification", href: "/ai-recognition" },
                { name: "Seller Portal", href: "/login" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="group flex items-center text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">Information</h3>
            <ul className="space-y-4 text-sm">
              {[
                { name: "About Our Origin", href: "/about" },
                { name: "Contact Support", href: "/contact" },
                { name: "Terms of Trading", href: "/terms" },
                { name: "Privacy Policy", href: "/privacy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="flex items-center text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">Visit Us</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary/70" />
                <span>Gem Street, Ratnapura,<br />Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary/70" />
                <span>+94 (11) 234-5678</span>
              </li>
              <li className="pt-4">
                <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-5 border border-primary/10 shadow-inner">
                  <p className="font-semibold text-foreground mb-1">Newsletter</p>
                  <p className="text-xs mb-3">Get exotic gemstone insights monthly.</p>
                  <button
                    onClick={() => {
                      const user = localStorage.getItem("user");
                      if (user) {
                        toast.success("Thank you for subscribing to our newsletter!");
                      } else {
                        toast.error("Please login or register to subscribe to our newsletter!");
                      }
                    }}
                    className="text-xs font-bold text-primary flex items-center gap-1 group focus:outline-none transition-opacity hover:opacity-80"
                  >
                    Subscribe Now <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 <span className="font-semibold text-foreground">Royalstone Lanka</span>. Crafted for Excellence.
          </p>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Approved by SL Gem Auth</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
