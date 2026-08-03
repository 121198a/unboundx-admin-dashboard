import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Badge, Button, DataTable, Modal, SearchBar } from '../../components';
import { usePaginatedList } from '../../hooks';
import { userApi } from '../../api/api';
import { useToast } from '../../context';

/**
 * =====================================================================
 * USER MANAGEMENT
 * =====================================================================
 */

function initialsAvatar(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

 const AVATAR_STYLE = 'bg-purple-600 text-white';

function avatarStyle() {
  return AVATAR_STYLE;
}

function buildColumns(onDelete) {
  return [
  {
    key: "name",
    header: "Name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${avatarStyle(row.name)}`}
        >
          {initialsAvatar(row.name)}
        </div>

        <span>{row.name || "-"}</span>
      </div>
    ),
  },

  {
    key: "email",
    header: "Email",
    render: (row) => row.email || "-",
  },

  {
    key: "phone_number",
    header: "Phone",
    render: (row) => row.phone_number || "-",
  },

  {
    key: "providerType",
    header: "Provider Type",
    render: (row) => row.providerType || "-",
  },

  {
    key: "platformRegisterUser",
    header: "User Platform",
    render: (row) => row.platformRegisterUser || "-",
  },

  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge status={row.status === 1 ? "active" : "inactive"} />
    ),
  },

  {
    key: "createdAt",
    header: "Created At",
    render: (row) =>
      row.createdAt
        ? new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "-",
  },

  {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <button
        aria-label={`Delete ${row.name}`}
        title={`Delete ${row.name}`}
        onClick={() => onDelete(row)}
        className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    ),
  },
  ];
}

/* ==========================================================
   DELETE USER CONFIRMATION MODAL
========================================================== */

function DeleteUserModal({ user, deleting, onClose, onConfirm }) {
  return (
    <Modal
      open={Boolean(user)}
      onClose={deleting ? () => {} : onClose}
      title="Delete User"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={deleting}
            disabled={deleting}
            style={{ backgroundImage: "none" }}
            className="bg-red-600! text-white! hover:bg-red-700!"
          >
            Delete
          </Button>
        </>
      }
    >
      <p className="text-base text-(--ux-text)">
        Are you sure you want to delete{" "}
        <span className="font-semibold">{user?.name}</span>? This action
        cannot be undone.
      </p>
    </Modal>
  );
}

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const { rows, pagination, page, setPage, loading, error, reload } = usePaginatedList(userApi.list, {
    pageSize: 10,
    search,
  });

  const openDelete = (row) => setUserToDelete(row);
  const closeDelete = () => {
    if (deleting) return;
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await userApi.remove(userToDelete.id);
      showToast('User deleted successfully.', 'success');
      setUserToDelete(null);
      reload();
    } catch (err) {
      showToast(err?.message || 'Could not delete this user. Please try again.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = buildColumns(openDelete);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--ux-text)">User Management</h1>

      <SearchBar placeholder="Search users..." onSearch={setSearch} />

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
        emptyTitle="No users found"
        emptyMessage="Try adjusting your search."
      />

      <DeleteUserModal
        user={userToDelete}
        deleting={deleting}
        onClose={closeDelete}
        onConfirm={handleDelete}
      />
    </div>
  );
}