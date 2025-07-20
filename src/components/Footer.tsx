import { Leaf, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '#home' },
        { name: 'Shop', href: '#shop' },
        { name: 'About Us', href: '#about' },
        { name: 'Contact', href: '#contact' }
      ]
    },
    {
      title: 'Categories',
      links: [
        { name: 'Citrus Fruits', href: '#' },
        { name: 'Tropical Fruits', href: '#' },
        { name: 'Berries', href: '#' },
        { name: 'Seasonal Fruits', href: '#' }
      ]
    },
    {
      title: 'Customer Service',
      links: [
        { name: 'FAQ', href: '#' },
        { name: 'Shipping Info', href: '#' },
        { name: 'Returns', href: '#' },
        { name: 'Support', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Youtube, href: '#', name: 'Youtube' }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold">FreshFruits</span>
            </div>
            <p className="text-primary-foreground/80 mb-6">
              Delivering fresh, organic fruits from local farms to your doorstep. 
              Taste the difference quality makes.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-primary-foreground/20">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Stay Fresh with Updates</h3>
            <p className="text-primary-foreground/80 mb-4">
              Get the latest fruit arrivals and special offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
              />
              <button className="px-6 py-2 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
          <p>&copy; 2024 FreshFruits. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;