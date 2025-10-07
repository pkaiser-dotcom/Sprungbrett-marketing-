import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LayoutDashboard, Users, CheckSquare, Brain, Settings, Building2 } from "lucide-react";

const navigationItems = [
  { name: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { name: "Team", url: createPageUrl("Team"), icon: Users },
  { name: "Aufgaben", url: createPageUrl("Tasks"), icon: CheckSquare },
  { name: "Kunden", url: createPageUrl("Customers"), icon: Building2 }, // NEU
  { name: "KI-Zuweisung", url: createPageUrl("AIAllocation"), icon: Brain },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen text-slate-50 relative">
      {/* Hintergrund als eigene, nicht-blockierende Ebene */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background:
            `linear-gradient(135deg, #050507 0%, #0b0c11 50%, #050507 100%)`,
        }}
      />
      {/* zarte horizontale Linien (subtil, aber animiert) */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 h-[30vh] -z-10 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              rgba(16,185,129,0.35) 0px,
              rgba(16,185,129,0.35) 2px,
              transparent 2px,
              transparent 140px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(59,130,246,0.25) 0px,
              rgba(59,130,246,0.25) 2px,
              transparent 2px,
              transparent 180px
            )`,
          backgroundPosition: "0% 25%, 0% 70%",
          animation: "linesSlide 18s linear infinite",
          opacity: 0.5,
        }}
      />

      <style>{`
        @keyframes linesSlide {
          from { background-position: -200% 25%, -200% 70%; }
          to   { background-position: 200% 25%, 200% 70%; }
        }
      `}</style>

      {/* Top Navigation */}
      <nav className="bg-black/70 backdrop-blur-xl border-b border-slate-700/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Sprungbrett Marketing</h1>
            </div>

            {/* Navigation Pills */}
            <div className="flex items-center bg-slate-800/70 p-1 rounded-xl border border-slate-700/60 shadow-md">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                      ${isActive
                        ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-md"
                        : "text-slate-300 hover:bg-slate-700/60 hover:text-white"
                      }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Settings */}
            <button className="w-10 h-10 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:bg-slate-700/60 hover:text-white transition">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
