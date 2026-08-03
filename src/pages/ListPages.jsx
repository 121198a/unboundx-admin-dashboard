import { useState } from 'react';
import { Badge, DataTable, SearchBar } from '../components';
import { usePaginatedList } from '../hooks';
import {
  activityApi,
  competitionApi,
  missionApi,
  widgetApi,
  portfolioApi,
  interactionPointsApi,
  algorithmApi,
  stockPollApi,
  notificationApi,
  categoryApi,
  reportApi,
  shortEmbeddedVideoApi,
  zenithAuditApi,
  serverMaintenanceApi,
  waitListApi,
  appVersionApi,
  resourcesApi,
  marketingEmailApi,
  marketingApi,
} from '../api/api';

/**
 * =====================================================================
 * ALL THE SIMPLE LIST PAGES — one file, all wired to their live APIs.
 * =====================================================================
 */

function ListPageShell({ title, columns, api, searchPlaceholder = 'Search...' }) {
  // Search text typed into the SearchBar below. This was previously
  // commented out while still being referenced further down, which made
  // every page built on ListPageShell crash with "search is not defined".
  const [search, setSearch] = useState('');
  const { rows, pagination, page, setPage, loading, error, reload } = usePaginatedList(api.list, {
    pageSize: 10,
    search,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--ux-text)">{title}</h1>

      <SearchBar placeholder={searchPlaceholder} onSearch={setSearch} />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        onRetry={reload}
        page={page}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={() => {}}
        emptyTitle={`No ${title.toLowerCase()} yet`}
        emptyMessage="Try adjusting your search."
      />
    </div>
  );
}

const statusBadge = (r) => <Badge status={r.status || 'active'} />;
const dateCol = (field) => (r) => (r[field] ? new Date(r[field]).toLocaleDateString() : '-');

export function Activity() {
  return (
    <ListPageShell
      api={activityApi}
      title="Activity"
      searchPlaceholder="Search activity..."
      columns={[
        { key: 'user', header: 'User' },
        { key: 'action', header: 'Action' },
        { key: 'details', header: 'Details' },
        { key: 'status', header: 'Status', render: statusBadge },
        { key: 'created_at', header: 'Date', render: dateCol('created_at') },
      ]}
    />
  );
}

export function Competition() {
  return (
    <ListPageShell
      api={competitionApi}
      title="Competition"
      searchPlaceholder="Search competitions..."
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'participants', header: 'Participants' },
        { key: 'prize', header: 'Prize' },
        { key: 'status', header: 'Status', render: statusBadge },
        { key: 'start_date', header: 'Start Date', render: dateCol('start_date') },
        { key: 'end_date', header: 'End Date', render: dateCol('end_date') },
      ]}
    />
  );
}

export function Missions() {
  return (
    <ListPageShell
      api={missionApi}
      title="Missions"
      searchPlaceholder="Search missions..."
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'type', header: 'Type' },
        { key: 'reward', header: 'Reward' },
        { key: 'status', header: 'Status', render: statusBadge },
        { key: 'created_at', header: 'Created At', render: dateCol('created_at') },
      ]}
    />
  );
}

export function Widgets() {
  return (
    <ListPageShell
      api={widgetApi}
      title="Widgets"
      searchPlaceholder="Search widgets..."
      columns={[
        { key: 'name', header: 'Widget Name' },
        { key: 'type', header: 'Type' },
        { key: 'position', header: 'Position' },
        { key: 'status', header: 'Status', render: statusBadge },
      ]}
    />
  );
}

export function Portfolios() {
  return (
    <ListPageShell
      api={portfolioApi}
      title="Portfolios"
      searchPlaceholder="Search portfolios..."
      columns={[
        { key: 'user', header: 'User' },
        { key: 'holdings', header: 'Holdings' },
        { key: 'value', header: 'Value', render: (r) => (r.value != null ? `$${r.value}` : '-') },
        { key: 'status', header: 'Status', render: statusBadge },
      ]}
    />
  );
}

export function InteractionPoints() {
  return (
    <ListPageShell
      api={interactionPointsApi}
      title="Manage Interaction Points"
      searchPlaceholder="Search interaction points..."
      columns={[
        { key: 'action', header: 'Action' },
        { key: 'points', header: 'Points' },
        { key: 'category', header: 'Category' },
      ]}
    />
  );
}

export function Algorithm() {
  return (
    <ListPageShell
      api={algorithmApi}
      title="Manage Algorithm"
      searchPlaceholder="Search algorithms..."
      columns={[
        { key: 'name', header: 'Algorithm Name' },
        { key: 'version', header: 'Version' },
        { key: 'status', header: 'Status', render: statusBadge },
        { key: 'updated_at', header: 'Last Updated', render: dateCol('updated_at') },
      ]}
    />
  );
}

export function StockPoll() {
  return (
    <ListPageShell
      api={stockPollApi}
      title="Stock Poll"
      searchPlaceholder="Search stock polls..."
      columns={[
        { key: 'ticker', header: 'Ticker' },
        { key: 'votes_up', header: 'Votes Up' },
        { key: 'votes_down', header: 'Votes Down' },
        { key: 'status', header: 'Status', render: statusBadge },
      ]}
    />
  );
}

export function Notification() {
  return (
    <ListPageShell
      api={notificationApi}
      title="Notification"
      searchPlaceholder="Search notifications..."
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'message', header: 'Message' },
        { key: 'audience', header: 'Audience' },
        { key: 'status', header: 'Status', render: (r) => <Badge status={r.read ? 'inactive' : 'active'}>{r.read ? 'Read' : 'Unread'}</Badge> },
        { key: 'sent_at', header: 'Sent At', render: dateCol('sent_at') },
      ]}
    />
  );
}

export function Category() {
  return (
    <ListPageShell
      api={categoryApi}
      title="Category"
      searchPlaceholder="Search categories..."
      columns={[
        { key: 'name', header: 'Category Name' },
        { key: 'items', header: 'Items' },
        { key: 'status', header: 'Status', render: statusBadge },
      ]}
    />
  );
}

export function ReportManagement() {
  return (
    <ListPageShell
      api={reportApi}
      title="Report Management"
      searchPlaceholder="Search reports..."
      columns={[
        { key: 'reporter', header: 'Reported By' },
        { key: 'target', header: 'Reported User' },
        { key: 'reason', header: 'Reason' },
        { key: 'status', header: 'Status', render: (r) => <Badge status={r.status || 'pending'} /> },
        { key: 'created_at', header: 'Date', render: dateCol('created_at') },
      ]}
    />
  );
}

export function ShortEmbeddedVideo() {
  return (
    <ListPageShell
      api={shortEmbeddedVideoApi}
      title="Short Embedded Video"
      searchPlaceholder="Search videos..."
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'url', header: 'Video URL' },
        { key: 'platform', header: 'Platform' },
        { key: 'status', header: 'Status', render: statusBadge },
        { key: 'created_at', header: 'Added On', render: dateCol('created_at') },
      ]}
    />
  );
}

export function ZenithAudit() {
  return (
    <ListPageShell
      api={zenithAuditApi}
      title="Zenith Audit"
      searchPlaceholder="Search audit log..."
      columns={[
        { key: 'action', header: 'Action' },
        { key: 'performed_by', header: 'Performed By' },
        { key: 'target', header: 'Target' },
        { key: 'created_at', header: 'Timestamp', render: dateCol('created_at') },
      ]}
    />
  );
}

export function ServerMaintenance() {
  return (
    <ListPageShell
      api={serverMaintenanceApi}
      title="Server Maintenance"
      searchPlaceholder="Search maintenance windows..."
      columns={[
        { key: 'title', header: 'Reason' },
        { key: 'start_time', header: 'Start', render: dateCol('start_time') },
        { key: 'end_time', header: 'End', render: dateCol('end_time') },
        { key: 'status', header: 'Status', render: statusBadge },
      ]}
    />
  );
}

export function WaitList() {
  return (
    <ListPageShell
      api={waitListApi}
      title="Wait List"
      searchPlaceholder="Search wait list..."
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'status', header: 'Status', render: statusBadge },
        { key: 'created_at', header: 'Joined At', render: dateCol('created_at') },
      ]}
    />
  );
}

export function AppVersion() {
  return (
    <ListPageShell
      api={appVersionApi}
      title="App Version"
      searchPlaceholder="Search versions..."
      columns={[
        { key: 'version', header: 'Version' },
        { key: 'platform', header: 'Platform' },
        { key: 'force_update', header: 'Force Update', render: (r) => (r.force_update ? 'Yes' : 'No') },
        { key: 'released_at', header: 'Released At', render: dateCol('released_at') },
      ]}
    />
  );
}

export function Resources() {
  return (
    <ListPageShell
      api={resourcesApi}
      title="Resources"
      searchPlaceholder="Search resources..."
      columns={[
        { key: 'title', header: 'Title' },
        { key: 'type', header: 'Type' },
        { key: 'status', header: 'Status', render: statusBadge },
        { key: 'created_at', header: 'Added On', render: dateCol('created_at') },
      ]}
    />
  );
}

export function MarketingEmail() {
  return (
    <ListPageShell
      api={marketingEmailApi}
      title="Marketing Email"
      searchPlaceholder="Search marketing emails..."
      columns={[
        { key: 'subject', header: 'Subject' },
        { key: 'audience', header: 'Audience' },
        { key: 'status', header: 'Status', render: statusBadge },
        { key: 'sent_at', header: 'Sent At', render: dateCol('sent_at') },
      ]}
    />
  );
}

export function Marketing() {
  return (
    <ListPageShell
      api={marketingApi}
      title="Marketing"
      searchPlaceholder="Search marketing campaigns..."
      columns={[
        { key: 'name', header: 'Campaign Name' },
        { key: 'channel', header: 'Channel' },
        { key: 'status', header: 'Status', render: statusBadge },
        { key: 'created_at', header: 'Created At', render: dateCol('created_at') },
      ]}
    />
  );
}
