import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { Bell, Settings, Menu, LogOut, X } from 'lucide-react';
import { NAV_ITEMS, APP_NAME } from '../constants';
import { useAuth } from '../context';
import { useLoginLogo } from '../hooks';

/**
 * =====================================================================
 * THE WHOLE POST-LOGIN SHELL
 * =====================================================================
 */

function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { logoUrl } = useLoginLogo();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-(--ux-topbar-height) bottom-0 z-40 flex w-(--ux-sidebar-width) shrink-0 flex-col border-r border-(--ux-border) bg-white transition-transform lg:static lg:inset-y-auto lg:top-auto lg:bottom-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-(--ux-topbar-height) items-center justify-between gap-3 px-6">
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt={`${APP_NAME} logo`}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <div className="leading-tight">
              <p className="ux-gradient-text text-base font-bold leading-none">
                {APP_NAME.toUpperCase()}
              </p>
              <p className="mt-1 text-xs text-(--ux-text-muted)">
                Admin Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="ux-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-(--ux-radius-active) px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-(--ux-text) hover:bg-gray-50"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { backgroundImage: "var(--ux-active-bg)" }
                  : undefined
              }
            >
              <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-(--ux-border) px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-(--ux-radius-active) bg-(--ux-purple-dark) px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-(--ux-purple) hover:shadow-md active:scale-[0.98]"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const { logoUrl } = useLoginLogo();

  const initial = (user?.name || user?.email || 'A').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20">
      <div className="flex h-(--ux-topbar-height) items-center justify-between border-b border-(--ux-border) bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="text-gray-500 hover:text-gray-700 lg:hidden" aria-label="Open menu">
            <Menu className="h-6 w-6" strokeWidth={1.75} />
          </button>
          <img src={logoUrl} alt={`${APP_NAME} logo`} className="h-9 w-9 rounded-full object-cover" />
          <span className="ux-gradient-text hidden text-xl font-bold sm:inline">{APP_NAME.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-5 sm:gap-6">
          <button type="button" className="flex items-center text-gray-500 hover:text-gray-800" aria-label="Notifications">
            <Bell className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <Link to="/dashboard/settings" className="flex items-center text-gray-500 hover:text-gray-700" aria-label="Settings">
            <Settings className="h-5 w-5" strokeWidth={1.75} />
          </Link>

          <div className="relative flex items-center">
            <div
              className="ux-gradient-ring flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white cursor-default"
              aria-label="User avatar"
            >
              {initial}
            </div>
          </div>
        </div>
      </div>

      <div className="h-0.75 w-full" style={{ background: 'var(--ux-gradient)' }} />
    </header>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-(--ux-bg)">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="ux-scrollbar flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
