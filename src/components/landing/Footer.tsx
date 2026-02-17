import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-primary-foreground/10">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif font-bold text-xl leading-none">HIMFED</div>
                  <div className="text-xs text-primary-foreground/70 leading-none">Smart Control System</div>
                </div>
              </Link>
              <p className="text-sm text-primary-foreground/70 max-w-md leading-relaxed">
                Comprehensive digital solution for HIMFED operations. Transforming farmer-to-godown
                management with complete transparency and government compliance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-secondary">Quick Links</h4>
              <ul className="space-y-2">
                {["Features", "Stock Availability", "Modules", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(" ", "-")}`}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-secondary">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Circular Road, Victory Tunnel, Shimla - 171003 (H.P)</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+91-177-2657580</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>himfed-hp@nic.in</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2025 HIMFED. Himachal Pradesh State Co-operative Marketing & Consumers Federation Ltd.
            </p>
            <div className="flex items-center gap-4 text-sm text-primary-foreground/60">
              <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
