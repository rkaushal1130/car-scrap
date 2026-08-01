import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, PhoneCall } from 'lucide-react';

interface HeaderProps {
  onOpenCalculator?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Process', href: '#process' },
    { label: 'Services', href: '#services' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'Facility', href: '#facility' },
    { label: 'Presence', href: '#presence' },
    { label: 'Contact', href: '#contact' },
  ];

  // ScrollSpy & Shadow / Transparency on Scroll
  useEffect(() => {
    const handleScroll = () => {
      // Toggle transparency & shadow on scroll
      setIsScrolled(window.scrollY > 40);

      // Active Section ScrollSpy
      const sections = navItems.map(item => item.href.substring(1));
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth Scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/35 backdrop-blur-md shadow-xs py-3 border-b border-gray-200/30'
          : 'bg-white/95 backdrop-blur-sm shadow-sm py-4.5'
      }`}
    >
      <div className="w-full px-5 sm:px-10 lg:px-14 flex items-center justify-between gap-8">
        {/* Company Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-4 group focus:outline-none shrink-0"
        >
          <img
            src="/images/logo.png"
            alt="Grand Global Junkyard & Recycling LLP Logo"
            className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl leading-none tracking-tight text-gray-900 font-['Outfit']">
              GRAND GLOBAL
            </span>
            <span className="text-xs font-extrabold text-[#0D7A41] tracking-wider uppercase mt-1 font-['Inter']">
              JUNKYARD & RECYCLING LLP
            </span>
            <span className="text-[9px] text-gray-500 font-semibold hidden sm:block font-['Inter'] mt-0.5">
              RECYCLE TODAY, FOR A BETTER TOMORROW
            </span>
          </div>
        </a>

        {/* Navigation Links: Bigger font + Increased spacing */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-10">
          {navItems.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = activeSection === sectionId;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-base font-bold transition-all duration-200 font-['Outfit'] inline-block hover:scale-110 origin-center relative py-1.5 ${
                  isActive
                    ? 'text-[#0D7A41]'
                    : 'text-gray-800 hover:text-[#0D7A41]'
                }`}
              >
                <span>{item.label}</span>
                {/* Underline renders ONLY for the selected/active section */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D7A41] rounded-full animate-in fade-in duration-200" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Phone Button */}
          <a
            href="tel:+917838791313"
            className="hidden xl:flex items-center gap-2.5 px-5 py-2.5 border border-[#0D7A41] rounded-full text-[#0D7A41] text-sm font-bold hover:bg-[#e6f4ec] transition-all bg-white/50 backdrop-blur-xs"
            title="Call Support"
          >
            <Phone className="w-4 h-4" />
            <span>+91-7838791313</span>
          </a>

          {/* Call Now Button */}
          <a
            href="tel:+917838791313"
            className="flex items-center gap-2 px-6 sm:px-7 py-3 bg-[#F97316] hover:bg-[#d95d03] text-white rounded-full text-sm font-extrabold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Now</span>
          </a>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#0D7A41] focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-6 flex flex-col gap-3.5 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const sectionId = item.href.substring(1);
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-base font-bold py-3 px-4 rounded-xl transition-all duration-200 flex justify-between items-center ${
                    isActive
                      ? 'text-[#0D7A41] bg-[#e6f4ec]'
                      : 'text-gray-800 hover:text-[#0D7A41]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-2.5 h-2.5 rounded-full bg-[#0D7A41]" />}
                </a>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            <a
              href="tel:+917838791313"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#F97316] text-white rounded-xl text-sm font-extrabold shadow-md"
            >
              <PhoneCall className="w-4.5 h-4.5" />
              Call Now (+91-7838791313)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
