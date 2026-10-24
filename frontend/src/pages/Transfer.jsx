import { useEffect, useState } from 'react';
import { accountApi, txApi } from '../services/api';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ accountId: '', receiverAccountNumber: '', amount: '', description: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    accountApi.list().then((a) => {
      setAccounts(a);
      setForm((f) => ({ ...f, accountId: a[0]?._id || '' }));
    });
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!window.confirm(`Send ₹${form.amount} to ${form.receiverAccountNumber}?`)) return;
    setBusy(true);
    try {
      const tx = await txApi.transfer({ ...form, amount: Number(form.amount) });
      setMsg({ ok: true, text: `Transfer successful. Reference: ${tx.referenceNumber}` });
      setForm((f) => ({ ...f, receiverAccountNumber: '', amount: '', description: '' }));
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.message || 'Transfer failed' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-2xl bg-white p-6 shadow">
      <h1 className="text-xl font-semibold">Send money</h1>
      <select className="w-full rounded-lg border p-2" value={form.accountId} onChange={set('accountId')}>
        {accounts.map((a) => <option key={a._id} value={a._id}>{a.accountNumber}</option>)}
      </select>
      <input className="w-full rounded-lg border p-2" placeholder="Receiver account number (12 digits)" required
        value={form.receiverAccountNumber} onChange={set('receiverAccountNumber')} />
      <input className="w-full rounded-lg border p-2" type="number" min="0.01" step="0.01" placeholder="Amount" required
        value={form.amount} onChange={set('amount')} />
      <input className="w-full rounded-lg border p-2" placeholder="Description"
        value={form.description} onChange={set('description')} />
      {msg && <p className={msg.ok ? 'text-green-600' : 'text-red-600'}>{msg.text}</p>}
      <button disabled={busy || !form.accountId} className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white disabled:opacity-50">
        {busy ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
