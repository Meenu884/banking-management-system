import { useEffect, useState } from 'react';
import { accountApi, txApi } from '../services/api';

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([accountApi.list(), txApi.list({ limit: 5 })])
      .then(([a, t]) => { setAccounts(a); setTxs(t.items); })
      .catch(() => setError('Could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-navy to-blue-600 p-6 text-white shadow">
        <p className="text-sm opacity-80">Total balance</p>
        <p className="text-3xl font-bold">{fmt(total)}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {accounts.length === 0 && <p className="text-slate-500">No accounts yet.</p>}
        {accounts.map((a) => (
          <div key={a._id} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm capitalize text-slate-500">{a.accountType} · {a.status}</p>
            <p className="font-mono">{a.accountNumber}</p>
            <p className="text-xl font-semibold">{fmt(a.balance)}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Recent transactions</h2>
        {txs.length === 0 && <p className="text-slate-500">No transactions yet.</p>}
        <ul className="divide-y">
          {txs.map((t) => (
            <li key={t._id} className="flex justify-between py-3">
              <div>
                <p className="capitalize">{t.displayType}</p>
                <p className="text-xs text-slate-500">{t.referenceNumber}</p>
              </div>
              <p className={t.direction === 'in' ? 'text-green-600' : 'text-red-600'}>
                {t.direction === 'in' ? '+' : '-'}{fmt(t.amount)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
