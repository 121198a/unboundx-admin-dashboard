import { forwardRef, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  Loader2,
  Search,
  X,
  Inbox,
  AlertTriangle,
  WifiOff,
  ShieldOff,
  ServerCrash,
  Clock,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useDebouncedValue } from './hooks';
import { useAuth } from './context';

/**
 * =====================================================================
 * SHARED UI COMPONENTS — one file (was split across 13 files before)
 * =====================================================================
 * Small, generic, reusable pieces. Page-specific UI stays in its own
 * page file under src/pages/.
 */

// ---- Button ----
const BUTTON_VARIANTS = {
  primary: 'text-white shadow-sm hover:opacity-95 active:opacity-90 disabled:opacity-60',
  secondary: 'bg-white text-(--ux-text) border border-(--ux-border) hover:bg-gray-50 disabled:opacity-60',
  danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-60',
  ghost: 'text-(--ux-text-muted) hover:bg-gray-100 disabled:opacity-60',
};

export function Button({ children, variant = 'primary', loading = false, disabled = false, type = 'button', className = '', onClick, ...rest }) {
  const style = variant === 'primary' ? { backgroundImage: 'var(--ux-active-bg)' } : undefined;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      className={`inline-flex items-center justify-center gap-2 rounded-(--ux-radius-button) px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 ${BUTTON_VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

// ---- Input ----
export const Input = forwardRef(function Input({ label, error, id, className = '', ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-(--ux-text)">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`w-full rounded-(--ux-radius-input) border px-4 py-3 text-sm text-(--ux-text) placeholder:text-gray-400 outline-none transition focus:border-(--ux-purple) focus:ring-2 focus:ring-purple-100 ${
          error ? 'border-red-400' : 'border-(--ux-border)'
        } ${className}`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

// ---- Badge ----
const BADGE_STYLES = {
  active: 'bg-emerald-500 text-white',
  inactive: 'bg-gray-300 text-gray-700',
  pending: 'bg-amber-400 text-white',
  banned: 'bg-red-500 text-white',
  neutral: 'bg-gray-100 text-gray-600',
};

export function Badge({ status = 'neutral', children }) {
  const key = String(status).toLowerCase();
  const style = BADGE_STYLES[key] || BADGE_STYLES.neutral;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${style}`}>
      {children || status}
    </span>
  );
}

const MODAL_SIZES = {
  md: 'max-w-md',
  lg: 'max-w-3xl',
};

// ---- Modal ----
export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`flex max-h-[90vh] w-full ${MODAL_SIZES[size] || MODAL_SIZES.md} flex-col rounded-(--ux-radius-card) bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-(--ux-border) px-6 py-4">
          <h3 className="text-base font-semibold text-(--ux-text)">{title}</h3>
          <button onClick={onClose} aria-label="Close dialog" className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto ux-scrollbar px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-(--ux-border) px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

// ---- Loader ----
export function Loader({ label = 'Loading...', full = false }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-(--ux-text-muted) ${full ? 'py-24' : 'py-10'}`}>
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

// ---- Skeleton table rows (shown while a table is loading) ----
function SkeletonRow({ columns = 6 }) {
  return (
    <tr className="animate-pulse border-b border-(--ux-border)">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 rounded bg-gray-200" style={{ width: `${60 + ((i * 13) % 30)}%` }} />
        </td>
      ))}
    </tr>
  );
}

function SkeletonTable({ rows = 8, columns = 6 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} columns={columns} />
      ))}
    </>
  );
}

// ---- Empty state ----
export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="rounded-full bg-purple-50 p-4">
        <Icon className="h-7 w-7 text-(--ux-purple)" strokeWidth={1.75} />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-(--ux-text)">{title}</h3>
        {message && <p className="max-w-sm text-sm text-(--ux-text-muted)">{message}</p>}
      </div>
      {action}
    </div>
  );
}

// ---- Error state ----
const ERROR_CONFIG = {
  NETWORK_OR_CORS: { icon: WifiOff, title: 'Connection problem' },
  NO_INTERNET: { icon: WifiOff, title: 'No internet connection' },
  TIMEOUT: { icon: Clock, title: 'Request timed out' },
  FORBIDDEN: { icon: ShieldOff, title: 'Access denied' },
  NOT_FOUND: { icon: AlertTriangle, title: 'Not found' },
  SERVER: { icon: ServerCrash, title: 'Server error' },
  INVALID_TOKEN: { icon: KeyRound, title: 'Session expired' },
  INVALID_API_KEY: { icon: KeyRound, title: 'Invalid API key' },
  UNKNOWN: { icon: AlertTriangle, title: 'Something went wrong' },
};

export function ErrorState({ error, onRetry }) {
  const code = error?.code || 'UNKNOWN';
  const { icon: Icon, title } = ERROR_CONFIG[code] || ERROR_CONFIG.UNKNOWN;
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="rounded-full bg-red-50 p-4">
        <Icon className="h-7 w-7 text-red-400" strokeWidth={1.75} />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-(--ux-text)">{title}</h3>
        <p className="max-w-md text-sm text-(--ux-text-muted)">{error?.message || 'An unexpected error occurred. Please try again.'}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-1">
          Try again
        </Button>
      )}
    </div>
  );
}

// ---- Pagination ----
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function getPageNumbers(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
}

export function Pagination({ page, pageSize, total, totalPages, onPageChange, onPageSizeChange }) {
  if (!total) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-(--ux-border) px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-(--ux-text-muted)">
        <span>Showing {start} to {end} of {total} results</span>
        {onPageSizeChange && (
          <>
            <span className="ml-2">Show</span>
            <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="rounded-(--ux-radius-button) border border-(--ux-border) px-2 py-1 text-sm outline-none">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>per page</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-(--ux-text-muted)">
        <span className="mr-2 hidden sm:inline">Page</span>
        <button onClick={() => onPageChange(1)} disabled={page === 1} aria-label="First page" className="rounded-(--ux-radius-button) border border-(--ux-border) p-1.5 disabled:opacity-40">
          <ChevronsLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} aria-label="Previous page" className="rounded-(--ux-radius-button) border border-(--ux-border) p-1.5 disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        {pageNumbers.map((p, idx) => {
          const prev = pageNumbers[idx - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-2">
              {showEllipsis && <span className="px-1">...</span>}
              <button
                onClick={() => onPageChange(p)}
                aria-current={p === page ? 'page' : undefined}
                className={`h-8 min-w-8 rounded-(--ux-radius-button) px-2 text-sm font-medium ${p === page ? 'text-white' : 'border border-(--ux-border) hover:bg-gray-50'}`}
                style={p === page ? { backgroundImage: 'var(--ux-active-bg)' } : undefined}
              >
                {p}
              </button>
            </span>
          );
        })}
        <span className="mx-1 hidden sm:inline">of {totalPages}</span>
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} aria-label="Next page" className="rounded-(--ux-radius-button) border border-(--ux-border) p-1.5 disabled:opacity-40">
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} aria-label="Last page" className="rounded-(--ux-radius-button) border border-(--ux-border) p-1.5 disabled:opacity-40">
          <ChevronsRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

// ---- Search bar ----
export function SearchBar({ placeholder = 'Search...', onSearch, delay = 500 }) {
  const [value, setValue] = useState('');
  const debounced = useDebouncedValue(value, delay);

  useEffect(() => {
    onSearch?.(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const handleClear = () => {
    setValue('');
    onSearch?.(''); // apply immediately, don't wait for the debounce
  };

  return (
    <div className="flex w-full gap-3">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-18px w-18px -translate-y-1/2 text-gray-400" strokeWidth={1.75} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-(--ux-radius-input) border border-(--ux-border) bg-white py-3 pl-11 pr-4 text-sm text-(--ux-text) placeholder:text-gray-400 outline-none transition focus:border-(--ux-purple) focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-(--ux-radius-input) border border-(--ux-border) bg-white px-4 py-2.5 text-sm font-medium text-(--ux-text) transition hover:bg-gray-50"
        >
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
}

// ---- Data table ----
export function DataTable({
  columns,
  rows,
  loading,
  error,
  onRetry,
  page,
  pagination,
  onPageChange,
  onPageSizeChange,
  emptyTitle = 'No records found',
  emptyMessage = 'Try adjusting your search or check back later.',
}) {
  return (
    <div className="overflow-hidden rounded-(--ux-radius-card) border border-(--ux-border) bg-white">
      <div className="overflow-x-auto ux-scrollbar">
        <table className="w-full min-w-720px text-left">
          <thead>
            <tr className="h-12 border-b border-(--ux-border)">
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-6 text-xs font-semibold uppercase tracking-wide text-(--ux-text-muted)">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <SkeletonTable columns={columns.length} rows={8} />}
            {!loading &&
              !error &&
              Array.isArray(rows) &&
              rows.map((row,i)=>(
                <tr key={row.id ?? i} className="border-b border-(--ux-border) last:border-0 hover:bg-gray-50/60">
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-6 py-4 text-sm text-(--ux-text)">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && error && (
        <div className="px-6">
          <ErrorState error={error} onRetry={onRetry} />
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="px-6">
          <EmptyState title={emptyTitle} message={emptyMessage} />
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <Pagination
          page={page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

// ---- Protected route wrapper (redirects to /login if not signed in) ----
export function ProtectedRoute() {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <Loader full label="Checking your session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
