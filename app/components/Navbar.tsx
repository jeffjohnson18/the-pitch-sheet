'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'The Mound Report', path: '/app' },
    { name: 'User Guide', path: '/user-guide' },
    { name: 'Pitching Metrics Explained', path: '/pitching-metrics' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-100/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src="/TMR LOGO.png" alt="The Mound Report Logo" className="h-8" />
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-b-2 border-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-border'
                        : 'text-gray-800 hover:text-gray-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
