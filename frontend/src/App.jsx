import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import { ROUTES } from './routes/web';

function QuickViewBar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isEmployee = location.pathname.startsWith('/employee');
  const isUser = !isAdmin && !isEmployee;

  return (
    <aside aria-label="Bộ chuyển đổi giao diện xem trước" className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-neutral-900/90 p-1.5 shadow-2xl backdrop-blur-md">
      <Link
        to={ROUTES.ADMIN.DASHBOARD}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          isAdmin
            ? 'bg-amber-400 text-neutral-950 shadow-md'
            : 'text-neutral-300 hover:text-white'
        }`}
      >
        Trang Admin
      </Link>
      <Link
        to={ROUTES.USER.HOME}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          isUser
            ? 'bg-amber-400 text-neutral-950 shadow-md'
            : 'text-neutral-300 hover:text-white'
        }`}
      >
        Trang User
      </Link>
      <Link
        to={ROUTES.EMPLOYEE.DASHBOARD}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
          isEmployee
            ? 'bg-amber-400 text-neutral-950 shadow-md'
            : 'text-neutral-300 hover:text-white'
        }`}
      >
        Trang Employee
      </Link>
    </aside>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* Nút chuyển nhanh giữa các trang */}
      <QuickViewBar />

      {/* Toàn bộ router tập trung tại src/routes */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
