import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components';

export default function ErrorPage({ code = 404, message = "The page you're looking for doesn't exist." }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--ux-bg) px-4 text-center">
      <div className="mb-4 rounded-full bg-purple-50 p-5">
        <AlertTriangle className="h-8 w-8 text-purple-400" />
      </div>
      <h1 className="ux-gradient-text text-5xl font-extrabold">{code}</h1>
      <p className="mt-2 max-w-sm text-sm text-(--ux-text-muted)">{message}</p>
      <Link to="/dashboard/users" className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
