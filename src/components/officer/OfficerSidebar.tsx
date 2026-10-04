import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Map,
  BarChart3,
  ClipboardCheck,
  Bell,
  Users,
  Settings,
  LogOut,
  Droplets,
  ShieldCheck,
} from 'lucide-react';
import { OfficerProfile } from '../../types';

interface OfficerSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  officerProfile: OfficerProfile;
  unreadNotifications: number;
}

export const OfficerSidebar: React.FC<OfficerSidebarProps> = ({
  currentTab,
  setCurrentTab,
  officerProfile,
  unreadNotifications,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'map', label: 'Map View', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'inspection', label: 'Inspection Queue', icon: ClipboardCheck },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifications,
    },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      id="officer-sidebar"
      className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 select-none min-h-screen"
    >
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
            <Droplets className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1">
              FloodCrop <span className="text-emerald-400">Snap</span>
            </h2>
            <p className="text-[11px] text-emerald-400/90 font-medium">
              Live Assessment Center
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-blue-700' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Officer Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-500/50">
            <img
              src={officerProfile.avatarUrl}
              alt={officerProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {officerProfile.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {officerProfile.role}
            </p>
            <p className="text-[9px] text-emerald-400 font-mono">
              {officerProfile.district} • {officerProfile.id}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.alert('Signed in as authorized Agriculture Officer')}
          className="w-full text-left text-[11px] font-semibold text-slate-400 hover:text-rose-400 flex items-center gap-1.5 py-1 px-1 transition-colors"
        >
          <LogOut className="w-3 h-3" />
          <span>Officer Session Active</span>
        </button>
      </div>
    </aside>
  );
};
