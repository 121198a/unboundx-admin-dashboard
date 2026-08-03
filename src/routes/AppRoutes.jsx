import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components';
import DashboardLayout from '../layouts/DashboardLayout';
import ErrorPage from '../pages/ErrorPage';

import Login from '../pages/auth/Login';

import UserManagement from '../pages/users/UserManagement';
import Settings from '../pages/settings/Settings';
import Profile from '../pages/profile/Profile';
import { LevelActivityList, LevelActivityView } from '../pages/levelActivity/LevelActivity';

import {
  Activity,
  Competition,
  Missions,
  Widgets,
  Portfolios,
  InteractionPoints,
  Algorithm,
  StockPoll,
  Notification,
  Category,
  ReportManagement,
  ShortEmbeddedVideo,
  ZenithAudit,
  ServerMaintenance,
  WaitList,
  AppVersion,
  Resources,
  MarketingEmail,
  Marketing,
} from '../pages/ListPages';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/users" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Navigate to="/dashboard/users" replace />} />
          <Route path="/dashboard/users" element={<UserManagement />} />
          <Route path="/dashboard/activity" element={<Activity />} />
          <Route path="/dashboard/competition" element={<Competition />} />
          <Route path="/dashboard/missions" element={<Missions />} />
          <Route path="/dashboard/widgets" element={<Widgets />} />
          <Route path="/dashboard/portfolios" element={<Portfolios />} />
          <Route path="/dashboard/interaction-points" element={<InteractionPoints />} />
          <Route path="/dashboard/algorithm" element={<Algorithm />} />
          <Route path="/dashboard/stock-poll" element={<StockPoll />} />
          <Route path="/dashboard/notifications" element={<Notification />} />
          <Route path="/dashboard/category" element={<Category />} />
          <Route path="/dashboard/reports" element={<ReportManagement />} />
          <Route path="/dashboard/short-embedded-video" element={<ShortEmbeddedVideo />} />
          <Route path="/dashboard/level-activity" element={<LevelActivityList />} />
          <Route path="/dashboard/level-activity/:id" element={<LevelActivityView />} />
          <Route path="/dashboard/zenith-audit" element={<ZenithAudit />} />
          <Route path="/dashboard/server-maintenance" element={<ServerMaintenance />} />
          <Route path="/dashboard/wait-list" element={<WaitList />} />
          <Route path="/dashboard/app-version" element={<AppVersion />} />
          <Route path="/dashboard/resources" element={<Resources />} />
          <Route path="/dashboard/marketing-email" element={<MarketingEmail />} />
          <Route path="/dashboard/marketing" element={<Marketing />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<ErrorPage code={404} message="The page you're looking for doesn't exist." />} />
    </Routes>
  );
}
