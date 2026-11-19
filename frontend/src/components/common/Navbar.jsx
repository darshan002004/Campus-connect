import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  CalendarDays,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
  ShieldCheck,
  ChevronDown,
  Layers,
  GraduationCap,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast({ type: 'info', message: 'You have been signed out successfully' });
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
      isActive
        ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block text-base font-medium px-4 py-2.5 rounded-lg transition-colors ${
      isActive
        ? 'text-indigo-600 bg-indigo-50 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 bg-clip-text text-transparent">
                CampusConnect
              </span>
              <span className="hidden sm:block text-[10px] tracking-wide font-semibold text-slate-400 uppercase">
                College Event Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/events" className={navLinkClass}>
              Events Catalog
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Portal
            </NavLink>

            {/* Role-Specific Nav Links */}
            {isAuthenticated && isStudent && (
              <>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <NavLink to="/student/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/student/registrations" className={navLinkClass}>
                  My Registrations
                </NavLink>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <NavLink to="/admin/dashboard" className={navLinkClass}>
                  Admin Console
                </NavLink>
                <NavLink to="/admin/events" className={navLinkClass}>
                  Manage Events
                </NavLink>
                <NavLink to="/admin/registrations" className={navLinkClass}>
                  Registrations
                </NavLink>
                <NavLink to="/admin/students" className={navLinkClass}>
                  Students
                </NavLink>
              </>
            )}
          </nav>

          {/* Desktop Right Area (Auth / Profile) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition"
                >
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize leading-tight">
                      {user?.role}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-indigo-50 text-indigo-700">
                        {user?.role} Mode
                      </span>
                    </div>

                    {isStudent ? (
                      <>
                        <Link
                          to="/student/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Student Dashboard
                        </Link>
                        <Link
                          to="/student/registrations"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <CalendarCheck className="w-4 h-4 text-slate-400" />
                          My Registrations
                        </Link>
                        <Link
                          to="/student/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Profile Settings
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Admin Console
                        </Link>
                        <Link
                          to="/admin/events"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <CalendarDays className="w-4 h-4 text-slate-400" />
                          Manage Events
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-200 transition"
                >
                  Student Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-1">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Events Catalog
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            About Portal
          </NavLink>

          {isAuthenticated ? (
            <>
              <div className="border-t border-slate-100 my-2 pt-2">
                <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {user?.role} Workspace
                </div>
                {isStudent ? (
                  <>
                    <NavLink
                      to="/student/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      Student Dashboard
                    </NavLink>
                    <NavLink
                      to="/student/registrations"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      My Registrations
                    </NavLink>
                    <NavLink
                      to="/student/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      Profile Settings
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      Admin Dashboard
                    </NavLink>
                    <NavLink
                      to="/admin/events"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      Manage Events
                    </NavLink>
                    <NavLink
                      to="/admin/registrations"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      Manage Registrations
                    </NavLink>
                    <NavLink
                      to="/admin/students"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileNavLinkClass}
                    >
                      Student Directory
                    </NavLink>
                  </>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left font-medium text-rose-600 px-4 py-2.5 rounded-lg hover:bg-rose-50 transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-semibold text-white bg-indigo-600 rounded-xl shadow-xs"
              >
                Student Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
