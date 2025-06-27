import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">Asheville Live</h3>
            <p className="text-gray-300 mb-6">
              Your complete guide to Asheville's vibrant music and entertainment scene. 
              Never miss a show again.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-sunset transition-colors p-2"
                onClick={() => window.open('https://facebook.com', '_blank')}
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-sunset transition-colors p-2"
                onClick={() => window.open('https://instagram.com', '_blank')}
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-sunset transition-colors p-2"
                onClick={() => window.open('https://twitter.com', '_blank')}
              >
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/events">
                  <Button variant="ghost" className="text-gray-300 hover:text-sunset transition-colors p-0 h-auto">
                    All Events
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/calendar">
                  <Button variant="ghost" className="text-gray-300 hover:text-sunset transition-colors p-0 h-auto">
                    Calendar
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/archive">
                  <Button variant="ghost" className="text-gray-300 hover:text-sunset transition-colors p-0 h-auto">
                    Event Archive
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Venues */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Featured Venues</h4>
            <ul className="space-y-2">
              <li>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-sunset transition-colors p-0 h-auto"
                  onClick={() => window.open('https://theorangepeel.net', '_blank')}
                >
                  The Orange Peel
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-sunset transition-colors p-0 h-auto"
                  onClick={() => window.open('https://www.thegreyeagle.com', '_blank')}
                >
                  The Grey Eagle
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-sunset transition-colors p-0 h-auto"
                  onClick={() => window.open('https://ashevillemusichall.com', '_blank')}
                >
                  Asheville Music Hall
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-sunset transition-colors p-0 h-auto"
                  onClick={() => window.open('https://oneworldbrewing.com', '_blank')}
                >
                  One World Brewing
                </Button>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-300 mb-4">
              Get weekly event updates delivered to your inbox.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-r-none text-charcoal"
              />
              <Button className="bg-sunset hover:bg-orange-600 rounded-l-none">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-sage mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2025 Asheville Live. Aggregating the best of Asheville's music scene.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Button variant="ghost" className="text-gray-300 hover:text-sunset text-sm p-0 h-auto">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-sunset text-sm p-0 h-auto">
              Terms of Service
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-sunset text-sm p-0 h-auto">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
