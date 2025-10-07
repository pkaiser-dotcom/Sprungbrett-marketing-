import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CheckSquare, Brain, Settings } from "lucide-react";

const navigationItems = [
  { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { name: "Team", url: "/team", icon: Users },
  { name: "Aufgaben", url: "/tasks", icon: CheckSquare },
  { name: "KI-Zuweisung", url: "/aiallocation", icon: Brain },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <style>{`
        .glass-effect-enhanced{background:rgba(15,23,42,.65);backdrop-filter:blur(18px) saturate(180%);border:1px solid rgba(16,185,129,.3);border-radius:.75rem}
        .nav-pill{transition:all .3s;position:relative}
        .nav-pill.active{background:linear-gradient(to right,#10b981,#3b82f6);color:#fff}
      `}</style>

      <nav className="bg-black/80 border-b border-slate-700/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Sprungbrett Marketing</h1>
            </div>

            <div className="flex items-center bg-slate-800/70 p-1 rounded-xl border border-slate-700/60">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link key={item.name} to={item.url}
                        className={`nav-pill flex items-center gap-2 px-4 py-2 rounded-lg ${isActive ? "active" : "text-slate-300"}`}>
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <button className="w-10 h-10 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-slate-300">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
}
