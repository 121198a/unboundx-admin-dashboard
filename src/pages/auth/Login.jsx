import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../../components';
import { useAuth } from '../../context';
import { useLoginLogo } from '../../hooks';
import { useToast } from '../../context';
import { APP_NAME } from '../../constants';

export default function Login() {
  const { login } = useAuth();
  const { logoUrl } = useLoginLogo();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const next = {};

    if (!form.email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      next.password = 'Password is required.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      await login(form.email.trim(), form.password);

      showToast('Login successful.', 'success');

      const redirectTo =
        location.state?.from?.pathname || '/dashboard/users';

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(
        err.message ||
          'Unable to sign in. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-(--ux-bg) px-4">
      {/* Background glow, using the brand gradient tones */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-purple-100 blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-orange-100 blur-3xl opacity-50" />

      <div className="relative w-full max-w-lg rounded-(--ux-radius-card) border border-(--ux-border) bg-white p-12 shadow-lg">
        {/* Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="ux-gradient-ring rounded-full p-2px">
            <img
              src={logoUrl}
              alt={`${APP_NAME} logo`}
              className="h-40 w-40 rounded-full object-cover bg-white"
            />
          </div>

          <h1 className="ux-gradient-text mt-5 text-3xl font-bold">
            {APP_NAME}
          </h1>

          <p className="mt-1.5 text-base text-(--ux-text-muted)">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {/* Email */}
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            error={errors.email}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                email: e.target.value,
              }))
            }
          />

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-(--ux-text)">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    password: e.target.value,
                  }))
                }
                className="w-full rounded-(--ux-radius-input) border border-(--ux-border) px-4 py-3 pr-12 text-sm outline-none transition focus:border-(--ux-purple) focus:ring-2 focus:ring-purple-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-3 flex h-full w-5 items-center justify-center border-0 bg-transparent p-0 text-slate-400 transition-colors duration-200 hover:text-(--ux-purple)"
              >
                {showPassword ? (
                  <EyeOff className="h-18px w-18px" strokeWidth={1.75} />
                ) : (
                  <Eye className="h-18px w-18px" strokeWidth={1.75} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {submitError && (
            <p
              role="alert"
              className="rounded-(--ux-radius-input) border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="ux-brand-gradient-hover mt-6 w-full rounded-(--ux-radius-button) py-3.5 font-semibold text-white shadow-md transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
