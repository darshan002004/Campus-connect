import React from 'react';
import {
  GraduationCap,
  Database,
  Server,
  Layout,
  Shield,
  Cpu,
  CheckCircle2,
  Users,
  KeyRound,
  FileCode2,
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Project Specification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About CampusConnect
        </h1>
        <p className="mt-3 text-slate-600 text-base leading-relaxed">
          CampusConnect is an enterprise-grade College Event Management System developed as a
          capstone project for the Master of Computer Applications (MCA) degree.
        </p>
      </div>

      {/* Demo Credentials Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <KeyRound className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            Instructor & Evaluator Demonstration Accounts
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Pre-seeded credentials are provided for rapid academic testing without manual signup:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="font-bold text-indigo-700 uppercase tracking-wider text-[10px]">
              Administrator Account
            </span>
            <p className="font-medium text-slate-800">Email: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">admin@campusconnect.edu</code></p>
            <p className="font-medium text-slate-800">Password: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">Admin@12345</code></p>
            <p className="text-slate-500 text-[11px] pt-1">Full access to create/edit/delete events, student directory & registrations.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
            <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px]">
              Sample Student Account
            </span>
            <p className="font-medium text-slate-800">Email: <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-600">rahul@campusconnect.edu</code></p>
            <p className="font-medium text-slate-800">Password: <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-600">Student@12345</code></p>
            <p className="text-slate-500 text-[11px] pt-1">Registered for Hackathon & AI workshop; test 1-click cancellations and booking.</p>
          </div>
        </div>
      </div>

      {/* Tech Stack Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Architecture & Technical Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Frontend */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layout className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Frontend Layer</h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>React 19 & Vite 8 SPA</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Tailwind CSS Modern Design System</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>React Router DOM v7 Routing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Axios with Bearer Interceptors</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Lucide React Icon System</span>
              </li>
            </ul>
          </div>

          {/* Backend */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Backend Layer</h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Node.js v24 runtime</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Express.js RESTful APIs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>JWT Authentication Middleware</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Role-Based Access Control (RBAC)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bcrypt Password Hashing</span>
              </li>
            </ul>
          </div>

          {/* Database */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Database Layer</h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>MongoDB v8 Native Instance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Mongoose ORM Schemas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Compound Unique Index (Student + Event)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Concurrency-Safe Atomic Increments</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Ready for MongoDB Atlas Cloud</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Database Integrity & Concurrency */}
      <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          Concurrency Safety & Seat Allocation Guarantee
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          In high-demand collegiate events (such as Hackathons and Tech Fests), hundreds of students
          attempt to register simultaneously. Traditional implementations suffer from race conditions
          causing over-allocation beyond venue capacity.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-xs text-indigo-700 uppercase tracking-wider">
              1. Atomic Check & Increment
            </div>
            <p className="text-xs text-slate-600">
              Seat incrementation executes at the database engine level via Mongoose atomic filter:{' '}
              <code>{`$expr: { $lt: ['$registeredCount', '$capacity'] }`}</code>. No two threads can claim the final seat.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-xs text-indigo-700 uppercase tracking-wider">
              2. Compound Uniqueness Constraint
            </div>
            <p className="text-xs text-slate-600">
              MongoDB enforces <code>{`{ studentId: 1, eventId: 1 }`}</code> unique compound index, preventing
              any double registration regardless of network latency or repeated button clicks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
