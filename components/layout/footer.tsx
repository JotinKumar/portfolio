import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/jotin", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/in/jotin", icon: Linkedin },
  { name: "Twitter", href: "https://twitter.com/jotin", icon: Twitter },
  { name: "Email", href: "mailto:contact@jotin.in", icon: Mail },
];

const footerLinks = {
  "Quick Links": [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/profile" },
    { name: "Articles", href: "/articles" },
    { name: "Projects", href: "/projects" },
  ],
  Resources: [
    { name: "Resume", href: "/resume.pdf" },
    { name: "Contact", href: "/contact" },
    { name: "Newsletter", href: "/newsletter" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl">Jotin Kumar</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Business Process Expert & Full Stack Developer passionate about
              transforming operations through intelligent automation.
            </p>
            <div className="flex space-x-2">
              {socialLinks.map((social) => (
                <Button key={social.name} variant="ghost" size="icon" asChild>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-semibold">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              © {new Date().getFullYear()} Jotin Kumar Madugula. All rights
              reserved.
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>using Next.js & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
