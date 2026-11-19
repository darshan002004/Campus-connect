import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Sparkles, Shield, Code, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Academic Overview */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CampusConnect</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A comprehensive collegiate event management system engineered for university students,
              faculty coordinators, and event organizers. Developed as an MCA final-year capstone project.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Academic Demo • Node.js & React & MongoDB Stack
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition">
                  Browse All Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  System Architecture
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Sign In / Demo Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Department Details */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Campus Contact
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Department of Computer Applications (MCA), Academic Block 4</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>events@campusconnect.edu</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusConnect. Final Year MCA Academic Project.</p>
          <div className="flex items-center gap-1">
            Built with React 19, Express REST APIs & MongoDB
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
