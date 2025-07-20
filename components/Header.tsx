import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout as logoutAction } from '../store/authSlice';
import { CodeIcon, MenuIcon, XIcon } from './IconComponents';
import ThemeSwitcher from './ThemeSwitcher';
import { AnimatePresence, motion } from 'framer-motion';

const Header: React.FC = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { about } = useAppSelector((state) => state.portfolio);
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const logout = () => {
    dispatch(logoutAction());
    closeMenu();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`;
  
  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xl transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : 'text-foreground'}`;

  const navLinks = (
    <>
      <NavLink to="/" className={isMenuOpen ? mobileNavLinkClass : navLinkClass} onClick={closeMenu}>Home</NavLink>
      <NavLink to="/experience" className={isMenuOpen ? mobileNavLinkClass : navLinkClass} onClick={closeMenu}>Experience</NavLink>
      <NavLink to="/projects" className={isMenuOpen ? mobileNavLinkClass : navLinkClass} onClick={closeMenu}>Projects</NavLink>
      <NavLink to="/services" className={isMenuOpen ? mobileNavLinkClass : navLinkClass} onClick={closeMenu}>Services</NavLink>
      <NavLink to="/blog" className={isMenuOpen ? mobileNavLinkClass : navLinkClass} onClick={closeMenu}>Blog</NavLink>
      <NavLink to="/contact" className={isMenuOpen ? mobileNavLinkClass : navLinkClass} onClick={closeMenu}>Contact</NavLink>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center mx-auto px-4">
          <div className="flex-1 flex justify-start">
            <NavLink to="/" className="flex items-center space-x-2">
              <CodeIcon className="h-6 w-6 text-primary" />
              <span className="font-bold hidden sm:inline-block">{about.name}</span>
            </NavLink>
          </div>
          
          <nav className="hidden md:flex items-center gap-x-6 text-sm font-medium">
            {navLinks}
          </nav>

          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <div className="hidden md:flex items-center gap-4 text-sm font-medium">
                {isLoggedIn ? (
                  <>
                    <NavLink to="/admin/dashboard" className={navLinkClass}>Dashboard</NavLink>
                    <button onClick={logout} className="text-sm text-muted-foreground hover:text-primary">Logout</button>
                  </>
                ) : (
                  <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                )}
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 -mr-2 text-foreground"
                aria-label="Toggle menu"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 md:hidden"
            onClick={closeMenu}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-background shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <span className="font-bold text-lg">Menu</span>
                <button onClick={closeMenu} className="p-2 -mr-2 text-foreground" aria-label="Close menu">
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <nav className="flex flex-col space-y-4">
                  {navLinks}
                </nav>
                <div className="mt-6 pt-6 border-t">
                  {isLoggedIn ? (
                    <div className="flex flex-col space-y-4">
                      <NavLink to="/admin/dashboard" className={mobileNavLinkClass} onClick={closeMenu}>Dashboard</NavLink>
                      <button onClick={logout} className="text-xl text-left text-foreground hover:text-primary">Logout</button>
                    </div>
                  ) : (
                    <NavLink to="/admin" className={mobileNavLinkClass} onClick={closeMenu}>Admin Login</NavLink>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;