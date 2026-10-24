import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../store';
import { authApi } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(form);
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow">
      <h1 className="text-xl font-semibold">Sign in to BankX</h1>
      <input className="w-full rounded-lg border p-2" type="email" placeholder="Email" required
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full rounded-lg border p-2" type="password" placeholder="Password" required
        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white disabled:opacity-50">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
