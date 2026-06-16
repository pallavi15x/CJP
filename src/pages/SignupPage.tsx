import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth, useToast } from '../contexts';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const result = signup(formData.name, formData.username, formData.email, formData.password);
      setLoading(false);

      if (result.success) {
        showToast('Account created! Welcome to CJP!', 'success');
        navigate('/');
      } else {
        setErrors({ form: result.error || 'Signup failed' });
      }
    }, 500);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">🪳</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Join the Movement</h1>
          <p className="text-text-secondary">Become a Certified Cockroach</p>
        </div>

        <div className="card bg-dark-card/80 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {errors.form}
              </div>
            )}

            <div>
              <label className="block text-sm text-text-secondary mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder="Your name"
                className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors ${
                  errors.name ? 'border-red-500' : 'border-dark-border'
                }`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={e => updateField('username', e.target.value.toLowerCase())}
                placeholder="unique_username"
                className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors ${
                  errors.username ? 'border-red-500' : 'border-dark-border'
                }`}
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder="your@email.com"
                className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors ${
                  errors.email ? 'border-red-500' : 'border-dark-border'
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => updateField('password', e.target.value)}
                  placeholder="Min 6 characters"
                  className={`w-full bg-dark-bg border rounded-lg px-4 py-3 pr-12 text-text-primary focus:outline-none focus:border-primary transition-colors ${
                    errors.password ? 'border-red-500' : 'border-dark-border'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={e => updateField('confirmPassword', e.target.value)}
                placeholder="Repeat your password"
                className={`w-full bg-dark-bg border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-dark-border'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
