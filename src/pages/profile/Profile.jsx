import { User } from 'lucide-react';
import { useAuth } from '../../context';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-(--ux-text)">Profile</h1>

      <div className="rounded-(--ux-radius-card) border border-(--ux-border) bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="ux-gradient-ring flex h-16 w-16 items-center justify-center rounded-full text-white">
            <User className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-semibold text-(--ux-text)">{user?.name || 'Admin User'}</p>
            <p className="text-sm text-(--ux-text-muted)">{user?.email || 'No email on file'}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-(--ux-text-muted)">Role</dt>
            <dd className="mt-1 text-sm text-(--ux-text)">{user?.role || 'Administrator'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-(--ux-text-muted)">User ID</dt>
            <dd className="mt-1 text-sm text-(--ux-text)">{user?.id || '-'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
