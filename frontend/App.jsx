import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';

function Protected({ children }) {
  const token = useSelector((s) => s.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-navy">
      {token && (
        <header className="flex items-center justify-between bg-navy px-6 py-4 text-white">
          <span className="font-bold">BankX</span>
          <nav className="flex gap-4 text-sm">
            <Link to="/">Dashboard</Link>
            <Link to="/transfer">Send Money</Link>
            <button onClick={() => { dispatch(logout()); navigate('/login'); }}>Logout</button>
          </nav>
        </header>
      )}
      <main className="mx-auto max-w-5xl p-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/transfer" element={<Protected><Transfer /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
