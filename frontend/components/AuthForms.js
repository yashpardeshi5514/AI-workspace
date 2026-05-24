'use client';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { validators, validateForm } from '@/utils/validation';
import { useNotifications } from './Notifications';
import axios from 'axios';
import { useAuthStore } from '@/hooks/useAuthStore';
export function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { token, login } = useAuthStore();
    const { error: showError } = useNotifications();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        // Validate
        const validationErrors = validateForm({ email, password }, {
            email: validators.email,
            password: (p) => (p.length >= 6 ? null : 'Password must be at least 6 characters'),
        });
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { email, password });
            login(res.data.token, res.data.user);
            onSuccess?.();
        }
        catch (err) {
            showError(err.response?.data?.message || 'Login failed');
        }
        finally {
            setIsLoading(false);
        }
    };
    const getFieldError = (field) => errors.find(e => e.field === field)?.message;
    return (<form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-3 py-2 bg-zinc-900 border rounded outline-none focus:border-blue-500 transition-colors ${getFieldError('email') ? 'border-red-600' : 'border-zinc-700'}`} placeholder="you@example.com" disabled={isLoading}/>
        {getFieldError('email') && (<p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3"/>
            {getFieldError('email')}
          </p>)}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-3 py-2 bg-zinc-900 border rounded outline-none focus:border-blue-500 transition-colors ${getFieldError('password') ? 'border-red-600' : 'border-zinc-700'}`} placeholder="••••••••" disabled={isLoading}/>
        {getFieldError('password') && (<p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3"/>
            {getFieldError('password')}
          </p>)}
      </div>

      <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-medium transition-colors">
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>
    </form>);
}
export function SignupForm({ onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const { login } = useAuthStore();
    const { error: showError } = useNotifications();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const passwordError = validators.password(password);
        const validationErrors = validateForm({ email, password, confirmPassword }, {
            email: validators.email,
            password: () => passwordError,
            confirmPassword: (p) => p !== password ? 'Passwords do not match' : null,
        });
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, { email, password });
            login(res.data.token, res.data.user);
            onSuccess?.();
        }
        catch (err) {
            showError(err.response?.data?.message || 'Signup failed');
        }
        finally {
            setIsLoading(false);
        }
    };
    const getFieldError = (field) => errors.find(e => e.field === field)?.message;
    return (<form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-3 py-2 bg-zinc-900 border rounded outline-none focus:border-blue-500 transition-colors ${getFieldError('email') ? 'border-red-600' : 'border-zinc-700'}`} placeholder="you@example.com" disabled={isLoading}/>
        {getFieldError('email') && (<p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3"/>
            {getFieldError('email')}
          </p>)}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-3 py-2 bg-zinc-900 border rounded outline-none focus:border-blue-500 transition-colors ${getFieldError('password') ? 'border-red-600' : 'border-zinc-700'}`} placeholder="••••••••" disabled={isLoading}/>
        {getFieldError('password') && (<p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3"/>
            {getFieldError('password')}
          </p>)}
        <p className="mt-1 text-xs text-zinc-400">
          Min 8 chars, 1 uppercase, 1 lowercase, 1 number
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full px-3 py-2 bg-zinc-900 border rounded outline-none focus:border-blue-500 transition-colors ${getFieldError('confirmPassword') ? 'border-red-600' : 'border-zinc-700'}`} placeholder="••••••••" disabled={isLoading}/>
        {getFieldError('confirmPassword') && (<p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3"/>
            {getFieldError('confirmPassword')}
          </p>)}
      </div>

      <button type="submit" disabled={isLoading} className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-medium transition-colors">
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>);
}
//# sourceMappingURL=AuthForms.js.map