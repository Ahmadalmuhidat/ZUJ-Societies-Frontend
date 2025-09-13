import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (!e.target.closest('header')) setMobileNavOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setMobileNavOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    const id = requestAnimationFrame(() => setMounted(true));
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(id);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Societies', path: '/societies' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className={`relative z-50 bg-white py-3 border-b shadow-sm font-inter transform transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-gray-900">ZUJ Societies</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(({ name, path }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === path
                    ? 'text-black underline underline-offset-4'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Right: Account */}
        <div className="relative flex-shrink-0 ml-2" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-medium text-gray-600 select-none">{isAuthenticated ? user?.Name : 'Account'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg z-50 ring-1 ring-black/10 focus:outline-none">
              {isAuthenticated ? (
                <>
                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                  <Link to="/my-societies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Societies</Link>
                  <Link to="/support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Support</Link>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100">Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                  <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign up</Link>
                  <Link to="/support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Support</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Mobile nav panel */}
      {mobileNavOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-2 space-y-2">
            <form onSubmit={handleSearch} className="flex">
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 px-3 py-3 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <button type="submit" className="px-4 py-3 bg-blue-600 text-white rounded-r hover:bg-blue-700 text-sm">Go</button>
            </form>
            <nav className="flex flex-col">
              {navItems.map(({ name, path }) => (
                <Link key={path} to={path} onClick={() => setMobileNavOpen(false)} className={`py-2 text-sm font-medium ${location.pathname === path ? 'text-black' : 'text-gray-700'} hover:text-black`}>
                  {name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
