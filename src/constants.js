import {
  Users,
  Activity,
  Trophy,
  Target,
  Columns2,
  Layers,
  Star,
  BarChart3,
  LineChart,
  Bell,
  ListTree,
  ShieldAlert,
  Clapperboard,
  Award,
  FileText,
  Server,
  ListChecks,
  Smartphone,
  BookOpen,
  Mail,
  Megaphone,
} from 'lucide-react';

export const APP_NAME = 'UnboundX';
export const DEFAULT_PAGE_SIZE = 10;

// Keys used to read/write localStorage. Keeping them here (instead of
// typing the raw string everywhere) avoids typos causing silent bugs.
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'ux_user',
  LOGIN_LOGO: 'ux_login_logo',
};

export const AUTH_STRATEGY = {
  BEARER: 'bearer',
  API_KEY: 'apiKey',
  COOKIE: 'cookie',
  BASIC: 'basic',
};


export const NAV_ITEMS = [
  { key: 'users', label: 'User Management', path: '/dashboard/users', icon: Users },
  { key: 'activity', label: 'Activity', path: '/dashboard/activity', icon: Activity },
  { key: 'competition', label: 'Competition', path: '/dashboard/competition', icon: Trophy },
  { key: 'missions', label: 'Missions', path: '/dashboard/missions', icon: Target },
  { key: 'widgets', label: 'Widgets', path: '/dashboard/widgets', icon: Columns2 },
  { key: 'portfolios', label: 'Portfolios', path: '/dashboard/portfolios', icon: Layers },
  { key: 'interaction-points', label: 'Manage Interaction Points', path: '/dashboard/interaction-points', icon: Star },
  { key: 'algorithm', label: 'Manage Algorithm', path: '/dashboard/algorithm', icon: BarChart3 },
  { key: 'stock-poll', label: 'Stock Poll', path: '/dashboard/stock-poll', icon: LineChart },
  { key: 'notification', label: 'Notification', path: '/dashboard/notifications', icon: Bell },
  { key: 'category', label: 'Category', path: '/dashboard/category', icon: ListTree },
  { key: 'report-management', label: 'Report Management', path: '/dashboard/reports', icon: ShieldAlert },
  { key: 'short-embedded-video', label: 'Short Embedded Video', path: '/dashboard/short-embedded-video', icon: Clapperboard },
  { key: 'level-activity', label: 'Level Activity', path: '/dashboard/level-activity', icon: Award },
  { key: 'zenith-audit', label: 'Zenith Audit', path: '/dashboard/zenith-audit', icon: FileText },
  { key: 'server-maintenance', label: 'Server Maintenance', path: '/dashboard/server-maintenance', icon: Server },
  { key: 'wait-list', label: 'Wait List', path: '/dashboard/wait-list', icon: ListChecks },
  { key: 'app-version', label: 'App Version', path: '/dashboard/app-version', icon: Smartphone },
  { key: 'resources', label: 'Resources', path: '/dashboard/resources', icon: BookOpen },
  { key: 'marketing-email', label: 'Marketing Email', path: '/dashboard/marketing-email', icon: Mail },
  { key: 'marketing', label: 'Marketing', path: '/dashboard/marketing', icon: Megaphone },
];