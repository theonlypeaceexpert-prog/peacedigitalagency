import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle, Linkedin } from "lucide-react";
import logoAsset from "@/assets/deepeace-logo-transparent.png.asset.json";
import { assetUrl } from "@/lib/asset-url";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <img
              src={assetUrl(logoAsset.url)}
              alt="DeePeace Agency"
              loading="lazy"
              decoding="async"
              className="h-14 md:h-16 w-auto object-contain mb-6 -ml-2"
            />
            <h3 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Let's build something <span className="text-accent">extraordinary.</span>
            </h3>
            <p className="mt-4 text-muted-foreground max-w-md">
              DǝǝPeaçeAɠency — a premium digital growth partner for ambitious eCommerce brands worldwide.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="https://wa.me/2347047858283" target="_blank" rel="noreferrer" className="glass rounded-full p-3 hover:scale-105 transition" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
              <a href="https://www.linkedin.com/in/deepeace-agency-988556426" target="_blank" rel="noreferrer" className="glass rounded-full p-3 hover:scale-105 transition" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://www.instagram.com/deepeaceagency" target="_blank" rel="noreferrer" className="glass rounded-full p-3 hover:scale-105 transition" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@dee.peace0" target="_blank" rel="noreferrer" className="glass rounded-full p-3 hover:scale-105 transition" aria-label="TikTok">
                <span className="text-sm font-bold">TT</span>
              </a>
              <a href="mailto:Theonlypeaceexpert@gmail.com" className="glass rounded-full p-3 hover:scale-105 transition" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Pages</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
              <li><Link to="/case-studies" className="hover:text-foreground">Case Studies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Theonlypeaceexpert@gmail.com</li>
              <li>+234 704 785 8283</li>
              <li>Worldwide · Remote</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} DǝǝPeaçeAɠency. All rights reserved.</p>
          <p>Crafted with precision · Premium digital growth</p>
        </div>
      </div>
    </footer>
  );
}
